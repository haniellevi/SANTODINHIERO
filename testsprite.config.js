module.exports = {
    apiKey: process.env.TESTSPRITE_API_KEY,
    reportDir: "./testsprite-reports",
    // Configurações adicionais para o projeto Santo Dinheiro
    projectName: "Santo Dinheiro",
    testTypes: ["unit", "integration", "e2e"],
    framework: "nextjs",
    execution: {
        projectPath: ".",
        prdPath: "./planejamento/prd.md",
        testCommand: "npm run test:unit",
        buildCommand: "npm run build",
        devCommand: "npm run dev",
    },
};
