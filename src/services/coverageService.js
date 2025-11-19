const coverageService = {
  async getCoverageData() {
    try {
      const response = await fetch('/coverage/lcov.info');
      if (!response.ok) {
        if (response.status === 404) {
          console.warn('Coverage file not found. Run tests with coverage to generate: npm run test:coverage');
        }
        return null;
      }
      const lcovData = await response.text();
      
      if (!lcovData || lcovData.trim().length === 0) {
        console.warn('Coverage file is empty. Coverage may not have been collected during tests.');
        return null;
      }
      
      const parsed = this.parseLcovData(lcovData);
      
      if (parsed && parsed.overall && parseFloat(parsed.overall.percentage) === 0) {
        console.warn('Coverage data parsed but shows 0%. This may indicate no coverage was collected.');
      }
      
      return parsed;
    } catch (error) {
      console.error('Error fetching coverage data:', error);
      console.info('To generate coverage: 1) Run tests with dev server: npm run dev (in one terminal) and npm test (in another), 2) Generate report: npm run coverage:report');
      return null;
    }
  },

  parseLcovData(lcovText) {
    if (!lcovText || lcovText.trim().length === 0) {
      console.warn('Empty LCOV data provided');
      return null;
    }

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
  },

  async checkCoverageAvailability() {
    try {
      const response = await fetch('/coverage/lcov.info', { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
};

export default coverageService;

