const coverageService = {
  async getCoverageData() {
    try {
      const response = await fetch('/coverage/lcov.info');
      if (!response.ok) {
        return null;
      }
      const lcovData = await response.text();
      return this.parseLcovData(lcovData);
    } catch (error) {
      console.error('Error fetching coverage data:', error);
      return null;
    }
  },

  parseLcovData(lcovText) {
    if (!lcovText) return null;

    const lines = lcovText.split('\n');
    let totalLines = 0;
    let coveredLines = 0;
    let totalFunctions = 0;
    let coveredFunctions = 0;
    let totalBranches = 0;
    let coveredBranches = 0;

    let currentFile = null;
    let fileLines = 0;
    let fileCovered = 0;
    let fileFunctions = 0;
    let fileCoveredFunctions = 0;
    let fileBranches = 0;
    let fileCoveredBranches = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('SF:')) {
        if (currentFile) {
          totalLines += fileLines;
          coveredLines += fileCovered;
          totalFunctions += fileFunctions;
          coveredFunctions += fileCoveredFunctions;
          totalBranches += fileBranches;
          coveredBranches += fileCoveredBranches;
        }
        currentFile = line.substring(3);
        fileLines = 0;
        fileCovered = 0;
        fileFunctions = 0;
        fileCoveredFunctions = 0;
        fileBranches = 0;
        fileCoveredBranches = 0;
      } else if (line.startsWith('LF:') && currentFile) {
        fileLines = parseInt(line.substring(3)) || 0;
      } else if (line.startsWith('LH:') && currentFile) {
        fileCovered = parseInt(line.substring(3)) || 0;
      } else if (line.startsWith('FNF:') && currentFile) {
        fileFunctions = parseInt(line.substring(4)) || 0;
      } else if (line.startsWith('FNH:') && currentFile) {
        fileCoveredFunctions = parseInt(line.substring(4)) || 0;
      } else if (line.startsWith('BRF:') && currentFile) {
        fileBranches = parseInt(line.substring(4)) || 0;
      } else if (line.startsWith('BRH:') && currentFile) {
        fileCoveredBranches = parseInt(line.substring(4)) || 0;
      } else if (line === 'end_of_record' && currentFile) {
        totalLines += fileLines;
        coveredLines += fileCovered;
        totalFunctions += fileFunctions;
        coveredFunctions += fileCoveredFunctions;
        totalBranches += fileBranches;
        coveredBranches += fileCoveredBranches;
        currentFile = null;
      }
    }

    if (currentFile) {
      totalLines += fileLines;
      coveredLines += fileCovered;
      totalFunctions += fileFunctions;
      coveredFunctions += fileCoveredFunctions;
      totalBranches += fileBranches;
      coveredBranches += fileCoveredBranches;
    }

    const lineCoverage = totalLines > 0 ? (coveredLines / totalLines) * 100 : 0;
    const functionCoverage = totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 0;
    const branchCoverage = totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 0;
    
    const coverageValues = [lineCoverage];
    if (totalFunctions > 0) coverageValues.push(functionCoverage);
    if (totalBranches > 0) coverageValues.push(branchCoverage);
    const overallCoverage = coverageValues.length > 0 
      ? coverageValues.reduce((a, b) => a + b, 0) / coverageValues.length 
      : 0;

    return {
      lines: {
        total: totalLines,
        covered: coveredLines,
        percentage: lineCoverage.toFixed(1)
      },
      functions: {
        total: totalFunctions,
        covered: coveredFunctions,
        percentage: functionCoverage.toFixed(1)
      },
      branches: {
        total: totalBranches,
        covered: coveredBranches,
        percentage: branchCoverage.toFixed(1)
      },
      overall: {
        percentage: overallCoverage.toFixed(1)
      }
    };
  },

  formatCoveragePercentage(percentage) {
    return `${parseFloat(percentage).toFixed(1)}%`;
  }
};

export default coverageService;

