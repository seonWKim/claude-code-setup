"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectAgents = selectAgents;
function selectAgents(answers) {
    const agents = [];
    // Planner - always useful for production/enterprise
    if (answers.projectGoal === 'production' ||
        answers.projectGoal === 'enterprise') {
        agents.push({
            name: 'Planner',
            filename: 'planner.md',
            reason: 'Production/enterprise projects benefit from structured planning',
        });
    }
    // Architect - for production/enterprise or monorepo
    if (answers.projectGoal === 'production' ||
        answers.projectGoal === 'enterprise' ||
        answers.projectType === 'monorepo') {
        agents.push({
            name: 'Architect',
            filename: 'architect.md',
            reason: 'Complex projects need architectural guidance',
        });
    }
    // TDD Guide - for TDD testing approach
    if (answers.testingApproach === 'tdd') {
        agents.push({
            name: 'TDD Guide',
            filename: 'tdd-guide.md',
            reason: 'TDD approach selected - provides test-first development guidance',
        });
    }
    // Code Reviewer - for teams or when code review is required
    if (answers.requireCodeReview || answers.teamSize !== 'solo') {
        agents.push({
            name: 'Code Reviewer',
            filename: 'code-reviewer.md',
            reason: 'Team collaboration requires code review processes',
        });
    }
    // Security Reviewer - for high security or payments/blockchain
    if (answers.securityLevel === 'high' ||
        answers.hasPayments ||
        answers.hasBlockchain) {
        agents.push({
            name: 'Security Reviewer',
            filename: 'security-reviewer.md',
            reason: answers.securityLevel === 'high'
                ? 'High security level requires security reviews'
                : answers.hasPayments
                    ? 'Payment handling requires security reviews'
                    : 'Blockchain integration requires security reviews',
        });
    }
    // Build Error Resolver - for TypeScript projects
    if (answers.backendLanguage === 'typescript' || answers.hasFrontend) {
        agents.push({
            name: 'Build Error Resolver',
            filename: 'build-error-resolver.md',
            reason: 'TypeScript/frontend projects benefit from build error assistance',
        });
    }
    // E2E Runner - for E2E testing
    if (answers.e2eFramework !== 'none') {
        agents.push({
            name: 'E2E Runner',
            filename: 'e2e-runner.md',
            reason: `E2E testing with ${answers.e2eFramework} enabled`,
        });
    }
    // Doc Updater - for production/enterprise
    if (answers.projectGoal === 'production' ||
        answers.projectGoal === 'enterprise') {
        agents.push({
            name: 'Documentation Updater',
            filename: 'doc-updater.md',
            reason: 'Production projects need documentation maintenance',
        });
    }
    // Refactor Cleaner - for production/enterprise
    if (answers.projectGoal === 'production' ||
        answers.projectGoal === 'enterprise') {
        agents.push({
            name: 'Refactor Cleaner',
            filename: 'refactor-cleaner.md',
            reason: 'Production projects benefit from code cleanup capabilities',
        });
    }
    return agents;
}
//# sourceMappingURL=agents.js.map