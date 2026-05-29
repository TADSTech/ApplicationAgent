#!/usr/bin/env python3
"""
ProjectLinter.py - JobJockey Multi-Agent & Architectural Consistency Linter

This linter enforces consistency, SRE rules, and Nigeria-specific guardrails
for developers and autonomous agents working on the JobJockey codebase.
"""

import os
import sys
import ast
from pathlib import Path
from typing import Dict, List, Tuple

# Enable terminal colors for Windows/Unix
if sys.platform == "win32":
    os.system("color")

# Colors
GREEN = "\033[92m"
YELLOW = "\033[93m"
RED = "\033[91m"
BLUE = "\033[94m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

# Project structure guidelines from AGENTS.md / design.md
REQUIRED_DIRECTORIES = [
    "backend", "backend/agents", "backend/api", "backend/core",
    "backend/models", "backend/services", "backend/utils",
    "frontend", "frontend/src", "frontend/src/components",
    "frontend/src/components/agents", "frontend/src/components/jobs",
    "frontend/src/components/ui", "frontend/src/components/layout",
    "frontend/src/pages", "frontend/src/services", "frontend/src/hooks",
    "frontend/src/types",
]

REQUIRED_BACKEND_FILES = {
    "backend/agents/__init__.py": "Backend agents module package initialization",
    "backend/agents/base.py": "BaseAgent abstract base class and AgentState model",
    "backend/agents/orchestrator.py": "MultiAgentOrchestrator coordinator class",
    "backend/agents/job_agent.py": "JobAgent class for scraping and WAT/currency filtering",
    "backend/agents/resume_agent.py": "ResumeAgent class for tailoring and context adaptation",
    "backend/agents/contract_agent.py": "ContractAgent class for contract parsing & tax calculations",
    "backend/agents/linkedin_agent.py": "LinkedInAgent class for outreach and automated DMs",
    "backend/api/__init__.py": "API package file",
    "backend/api/routes.py": "FastAPI routing definitions",
    "backend/api/dependencies.py": "Dependencies (DB, Firestore, Auth hooks)",
    "backend/core/__init__.py": "Core configuration module initialization",
    "backend/core/config.py": "Settings and secrets loading",
    "backend/core/state.py": "Global state variables & session details",
    "backend/core/logging.py": "JSON structured logging setup",
    "backend/models/__init__.py": "Database models module package",
    "backend/models/job.py": "Pydantic Job schema",
    "backend/models/resume.py": "Pydantic Resume schema",
    "backend/models/application.py": "Pydantic Application schema",
    "backend/models/user.py": "Pydantic User schema",
    "backend/services/__init__.py": "External services module package",
    "backend/services/firecrawl.py": "Firecrawl scraping service wrapper",
    "backend/services/openai.py": "LLM client wrappers",
    "backend/services/linkedin.py": "LinkedIn service integrations",
    "backend/utils/__init__.py": "Utils module package",
    "backend/utils/currency.py": "USD/NGN currency conversions & calculations",
    "backend/utils/timezones.py": "WAT timezone alignment calculations",
    "backend/main.py": "FastAPI app entrypoint",
    "backend/requirements.txt": "Python package dependencies",
    "backend/Dockerfile": "Containerization setup",
}

REQUIRED_FRONTEND_FILES = {
    "frontend/src/pages/AutoMode.tsx": "AutoMode autonomous agent tracking visualizer",
    "frontend/src/pages/SwipeMode.tsx": "SwipeMode Tinder-style job curation UI",
    "frontend/src/pages/Dashboard.tsx": "Main client statistics dashboard",
    "frontend/src/pages/Settings.tsx": "Settings for salary targets and relocation",
    "frontend/src/services/api.ts": "Axios or fetch base client",
    "frontend/src/services/auth.ts": "Firebase Authentication provider client",
    "frontend/src/hooks/useAgents.ts": "State management hook to poll agent progress",
    "frontend/src/types/index.ts": "Shared typescript interfaces",
    "frontend/src/main.tsx": "React app entry mount file",
}


def print_header(title: str):
    print(f"\n{BOLD}{BLUE}{'=' * 60}{RESET}")
    print(f"{BOLD}{CYAN}{title.center(60)}{RESET}")
    print(f"{BOLD}{BLUE}{'=' * 60}{RESET}")


def check_directories() -> Tuple[int, int]:
    print_header("Directory Structure Verification")
    passed = 0
    total = len(REQUIRED_DIRECTORIES)

    for dir_path in REQUIRED_DIRECTORIES:
        path = Path(dir_path)
        if path.is_dir():
            print(f"  {GREEN}[OK]{RESET} Directory exists: {dir_path}")
            passed += 1
        else:
            print(f"  {YELLOW}[PENDING]{RESET} Missing directory: {dir_path}")

    return passed, total


def check_files(file_dict: Dict[str, str], title: str) -> Tuple[int, int, List[str]]:
    print_header(title)
    passed = 0
    total = len(file_dict)
    missing = []

    for file_path, description in file_dict.items():
        path = Path(file_path)
        if path.is_file():
            print(f"  {GREEN}[OK]{RESET} File exists: {file_path:<36} | {CYAN}{description}{RESET}")
            passed += 1
        else:
            print(f"  {YELLOW}[PENDING]{RESET} Missing file: {file_path:<36} | {RESET}{description}")
            missing.append(file_path)

    return passed, total, missing


def lint_agent_file(file_path: str) -> Tuple[List[str], List[str]]:
    errors = []
    warnings = []
    path = Path(file_path)
    if not path.is_file():
        return errors, warnings

    try:
        with open(path, "r", encoding="utf-8") as f:
            code = f.read()

        if not code.strip():
            warnings.append("WIP: File is completely empty.")
            return errors, warnings
        
        # SRE check: Using ast to find print statements prevents false positives in strings/comments
        tree = ast.parse(code, filename=file_path)
        
        # Find print functions
        for node in ast.walk(tree):
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name) and node.func.id == "print":
                    errors.append(
                        f"SRE Rule Violation: Raw 'print()' found at line {node.lineno}. "
                        "Agents must use structured JSON logging via backend.core.logging instead."
                    )

        # Inspect class names and base classes
        classes_defined = []
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                base_names = []
                for base in node.bases:
                    if isinstance(base, ast.Name):
                        base_names.append(base.id)
                    elif isinstance(base, ast.Attribute):
                        base_names.append(base.attr)
                classes_defined.append((node.name, base_names, node))

        # Check file specific classes
        file_name = path.name
        if file_name == "base.py":
            has_base_agent = any(c[0] == "BaseAgent" for c in classes_defined)
            has_agent_state = any(c[0] == "AgentState" for c in classes_defined)
            if not has_base_agent:
                warnings.append("WIP: 'BaseAgent' class not yet implemented.")
            if not has_agent_state:
                warnings.append("WIP: 'AgentState' schema not yet implemented.")
        elif file_name == "orchestrator.py":
            has_orch = any(c[0] == "MultiAgentOrchestrator" for c in classes_defined)
            if not has_orch:
                warnings.append("WIP: 'MultiAgentOrchestrator' class not yet implemented.")
        elif file_name in ["job_agent.py", "resume_agent.py", "contract_agent.py", "linkedin_agent.py"]:
            expected_class = "".join(part.capitalize() for part in file_name.replace(".py", "").split("_"))
            agent_class_info = next((c for c in classes_defined if c[0] == expected_class), None)
            
            if not agent_class_info:
                warnings.append(f"WIP: Expected class '{expected_class}' not yet implemented.")
            else:
                bases = agent_class_info[1]
                if "BaseAgent" not in bases:
                    errors.append(
                        f"Architecture Violation: Class '{expected_class}' "
                        "MUST inherit from 'BaseAgent'"
                    )
                
                # Check for run method
                class_node = agent_class_info[2]
                has_run_method = False
                is_run_async = False
                for subnode in class_node.body:
                    if isinstance(subnode, (ast.FunctionDef, ast.AsyncFunctionDef)) and subnode.name == "run":
                        has_run_method = True
                        if isinstance(subnode, ast.AsyncFunctionDef):
                            is_run_async = True

                if not has_run_method:
                    warnings.append(f"WIP: '{expected_class}' is missing required 'run' method.")
                elif not is_run_async:
                    errors.append(f"Interface Violation: 'run' method in '{expected_class}' MUST be asynchronous ('async def run')")

    except SyntaxError as se:
        errors.append(f"Syntax Error: {se}")
    except Exception as e:
        errors.append(f"Linter Exception processing file: {e}")

    return errors, warnings


def verify_sre_logic(missing_files: List[str]) -> Tuple[List[str], List[str]]:
    print_header("SRE & Reliability Validation")
    all_errors = []
    all_warnings = []
    
    agent_files = [
        "backend/agents/base.py",
        "backend/agents/orchestrator.py",
        "backend/agents/job_agent.py",
        "backend/agents/resume_agent.py",
        "backend/agents/contract_agent.py",
        "backend/agents/linkedin_agent.py"
    ]

    for agent_file in agent_files:
        if agent_file in missing_files:
            continue
        
        errors, warnings = lint_agent_file(agent_file)
        if errors or warnings:
            if errors:
                print(f"  {RED}{BOLD}[FAIL]{RESET} {BOLD}{agent_file}{RESET}: {len(errors)} error(s) found")
                for e in errors:
                    print(f"    - {RED}{e}{RESET}")
                    all_errors.append((agent_file, e))
            
            if warnings:
                print(f"  {YELLOW}{BOLD}[WARN]{RESET} {BOLD}{agent_file}{RESET}: {len(warnings)} warning(s) found")
                for w in warnings:
                    print(f"    - {YELLOW}{w}{RESET}")
                    all_warnings.append((agent_file, w))
        else:
            print(f"  {GREEN}{BOLD}[OK]{RESET} {BOLD}{agent_file}{RESET}: Architectural and SRE compliant")

    return all_errors, all_warnings


def check_nigeria_guards(missing_files: List[str]) -> Tuple[List[str], List[str]]:
    print_header("Nigeria-Specific Guardrail Audits")
    all_errors = []
    all_warnings = []

    # Currency Intelligence Check
    currency_path = "backend/utils/currency.py"
    if currency_path not in missing_files:
        try:
            with open(currency_path, "r", encoding="utf-8") as f:
                code = f.read()
            tree = ast.parse(code)
            
            funcs = [node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
            has_conversion = any("convert" in f.lower() or "ngn" in f.lower() or "usd" in f.lower() for f in funcs)
            
            if not has_conversion:
                all_warnings.append((currency_path, "Currency utility should define exchange calculation functions"))
                print(f"  {YELLOW}{BOLD}[WARN]{RESET} {currency_path}: No obvious USD/NGN conversion function defined yet (WIP)")
            else:
                print(f"  {GREEN}{BOLD}[OK]{RESET} {currency_path}: Implements conversion algorithms")
        except Exception as e:
            all_errors.append((currency_path, f"Error parsing: {e}"))
            print(f"  {RED}{BOLD}[FAIL]{RESET} {currency_path}: Error parsing - {e}")
    else:
        print(f"  {YELLOW}[PENDING]{RESET} {currency_path} is not yet implemented.")

    # Timezone Compatibility Check
    timezone_path = "backend/utils/timezones.py"
    if timezone_path not in missing_files:
        try:
            with open(timezone_path, "r", encoding="utf-8") as f:
                code = f.read()
            
            has_wat = "WAT" in code or "UTC+1" in code or "offset" in code or "timezone" in code
            if not has_wat:
                all_warnings.append((timezone_path, "Missing explicit West Africa Time (WAT) alignment rules"))
                print(f"  {YELLOW}{BOLD}[WARN]{RESET} {timezone_path}: Missing explicit West Africa Time (WAT) alignment rules (WIP)")
            else:
                print(f"  {GREEN}{BOLD}[OK]{RESET} {timezone_path}: Configured for West African Time zone (WAT/UTC+1)")
        except Exception as e:
            all_errors.append((timezone_path, f"Error parsing: {e}"))
            print(f"  {RED}{BOLD}[FAIL]{RESET} {timezone_path}: Error parsing - {e}")
    else:
        print(f"  {YELLOW}[PENDING]{RESET} {timezone_path} is not yet implemented.")

    return all_errors, all_warnings


def main():
    print(f"\n{BOLD}{CYAN}JobJockey Architectural Consistency & Specification Linter{RESET}")
    print(f"Started analysis on codebase relative to: {BOLD}{Path('.').resolve()}{RESET}\n")

    dir_ok, dir_total = check_directories()
    
    back_ok, back_total, back_missing = check_files(REQUIRED_BACKEND_FILES, "Core Backend Files Verification")
    front_ok, front_total, front_missing = check_files(REQUIRED_FRONTEND_FILES, "Core Frontend Files Verification")
    
    all_missing = back_missing + front_missing
    
    sre_errors, sre_warnings = verify_sre_logic(all_missing)
    nigeria_errors, nigeria_warnings = check_nigeria_guards(all_missing)

    print_header("Specification Lint Summary")
    
    total_items = dir_total + back_total + front_total
    passed_items = dir_ok + back_ok + front_ok
    missing_items = total_items - passed_items
    
    completion_rate = (passed_items / total_items) * 100
    total_errors = len(sre_errors) + len(nigeria_errors)
    total_warnings = len(sre_warnings) + len(nigeria_warnings)
    
    print(f"  {BOLD}Structure Completion Rate:{RESET} {completion_rate:.1f}% ({passed_items}/{total_items} items in place)")
    print(f"  {BOLD}Missing Directories/Files:{RESET} {missing_items}")
    print(f"  {BOLD}Active Rule Violations (Errors):{RESET} {total_errors}")
    print(f"  {BOLD}Pending Implementations (Warnings):{RESET} {total_warnings}")
    
    # We only FAIL the push if there are explicit ERRORs (bad inheritance, print statements, sync methods).
    # Missing files or missing internal boilerplate inside an existing file are just PENDING/WARNINGS.
    if total_errors == 0:
        if completion_rate == 100.0 and total_warnings == 0:
            print(f"\n{GREEN}{BOLD}[SUCCESS] PERFECT SCORE: Codebase is 100% compliant with JobJockey Specifications!{RESET}")
        else:
            print(f"\n{GREEN}{BOLD}[OK] COMPLIANT: Codebase has no critical violations. WIP elements remain.{RESET}")
        sys.exit(0)
    else:
        print(f"\n{RED}{BOLD}[FAIL] LINT FAILED: Codebase has {total_errors} critical architectural/SRE rule violations.{RESET}")
        sys.exit(1)


if __name__ == "__main__":
    main()
