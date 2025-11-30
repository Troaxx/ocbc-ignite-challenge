# Jenkins Email Templates

## Failure Trigger

### Subject:
```
❌ Build FAILED: $PROJECT_NAME - Build #$BUILD_NUMBER
```

### Content (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #f44336 0%, #c62828 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; background: #f9f9f9; }
        .status-box { background: #ffebee; border-left: 5px solid #f44336; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .status-box h2 { margin: 0 0 10px 0; color: #c62828; font-size: 20px; }
        .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #2196f3; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .info-box h3 { margin-top: 0; color: #1976d2; }
        .button { display: inline-block; padding: 12px 30px; background: #f44336; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; font-weight: bold; }
        .button-secondary { background: #666; color: white; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #f5f5f5; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; background: white; }
        table td { padding: 10px; border-bottom: 1px solid #eee; }
        table td:first-child { font-weight: bold; color: #555; width: 40%; }
        ul { margin: 10px 0; padding-left: 20px; }
        li { margin: 5px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>❌ Build Failed</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">$PROJECT_NAME</p>
        </div>
        
        <div class="content">
            <div class="status-box">
                <h2>⚠️ Build #$BUILD_NUMBER Has Failed</h2>
                <p style="margin: 0; font-size: 16px;">The test run encountered failures. Immediate attention required.</p>
            </div>
            
            <div class="info-box">
                <h3>📊 Build Information</h3>
                <table>
                    <tr>
                        <td>Build Number:</td>
                        <td><strong>#$BUILD_NUMBER</strong></td>
                    </tr>
                    <tr>
                        <td>Status:</td>
                        <td><strong style="color: #f44336;">FAILED</strong></td>
                    </tr>
                    <tr>
                        <td>Duration:</td>
                        <td>${BUILD_DURATION}</td>
                    </tr>
                    <tr>
                        <td>Triggered By:</td>
                        <td>$CAUSE</td>
                    </tr>
                </table>
            </div>
            
            <div class="warning">
                <h3 style="margin-top: 0; color: #856404;">🔍 What to Check:</h3>
                <ul>
                    <li>Review the console output for error messages</li>
                    <li>Check which specific tests failed</li>
                    <li>Review screenshots and test artifacts</li>
                    <li>Verify environment and configuration</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="$BUILD_URL" class="button">View Build Details</a>
                <a href="$BUILD_URL/console" class="button button-secondary">Console Output</a>
            </div>
            
            <div class="info-box">
                <h3>🔗 Quick Links</h3>
                <ul>
                    <li><a href="$BUILD_URL">Build #$BUILD_NUMBER Details</a></li>
                    <li><a href="$BUILD_URL/testReport/">Test Report</a></li>
                    <li><a href="$BUILD_URL/artifact/playwright-report/index.html">HTML Test Report</a></li>
                    <li><a href="$BUILD_URL/artifact/coverage/index.html">Code Coverage Report</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Jenkins CI/CD</strong></p>
            <p>Project: $PROJECT_NAME | Build: #$BUILD_NUMBER | Status: $BUILD_STATUS</p>
        </div>
    </div>
</body>
</html>
```

## Success Trigger

### Subject:
```
✅ Build SUCCESS: $PROJECT_NAME - Build #$BUILD_NUMBER
```

### Content (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; background: #f9f9f9; }
        .status-box { background: #e8f5e9; border-left: 5px solid #4caf50; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .status-box h2 { margin: 0 0 10px 0; color: #2e7d32; font-size: 20px; }
        .info-box { background: white; padding: 20px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #2196f3; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .info-box h3 { margin-top: 0; color: #1976d2; }
        .button { display: inline-block; padding: 12px 30px; background: #4caf50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; font-weight: bold; }
        .button-secondary { background: #666; color: white; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; background: #f5f5f5; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; background: white; }
        table td { padding: 10px; border-bottom: 1px solid #eee; }
        table td:first-child { font-weight: bold; color: #555; width: 40%; }
        ul { margin: 10px 0; padding-left: 20px; }
        li { margin: 5px 0; }
        .success-note { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 15px; margin: 15px 0; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Build Successful</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">$PROJECT_NAME</p>
        </div>
        
        <div class="content">
            <div class="status-box">
                <h2>🎉 Build #$BUILD_NUMBER Completed Successfully</h2>
                <p style="margin: 0; font-size: 16px;">All tests passed! The build is ready for deployment.</p>
            </div>
            
            <div class="info-box">
                <h3>📊 Build Information</h3>
                <table>
                    <tr>
                        <td>Build Number:</td>
                        <td><strong>#$BUILD_NUMBER</strong></td>
                    </tr>
                    <tr>
                        <td>Status:</td>
                        <td><strong style="color: #4caf50;">SUCCESS</strong></td>
                    </tr>
                    <tr>
                        <td>Duration:</td>
                        <td>${BUILD_DURATION}</td>
                    </tr>
                    <tr>
                        <td>Triggered By:</td>
                        <td>$CAUSE</td>
                    </tr>
                </table>
            </div>
            
            <div class="success-note">
                <h3 style="margin-top: 0; color: #2e7d32;">✨ Build Summary:</h3>
                <ul>
                    <li>All tests executed successfully</li>
                    <li>No errors or failures detected</li>
                    <li>Build artifacts generated successfully</li>
                    <li>Code coverage reports available</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="$BUILD_URL" class="button">View Build Details</a>
                <a href="$BUILD_URL/testReport/" class="button button-secondary">View Test Report</a>
            </div>
            
            <div class="info-box">
                <h3>🔗 Quick Links</h3>
                <ul>
                    <li><a href="$BUILD_URL">Build #$BUILD_NUMBER Details</a></li>
                    <li><a href="$BUILD_URL/testReport/">Test Report</a></li>
                    <li><a href="$BUILD_URL/artifact/playwright-report/index.html">HTML Test Report</a></li>
                    <li><a href="$BUILD_URL/artifact/coverage/index.html">Code Coverage Report</a></li>
                    <li><a href="$BUILD_URL/artifact/">All Build Artifacts</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Jenkins CI/CD</strong></p>
            <p>Project: $PROJECT_NAME | Build: #$BUILD_NUMBER | Status: $BUILD_STATUS</p>
            <p style="margin-top: 10px; font-size: 11px; color: #999;">This is an automated notification. Great job on a successful build! 🎉</p>
        </div>
    </div>
</body>
</html>
```

