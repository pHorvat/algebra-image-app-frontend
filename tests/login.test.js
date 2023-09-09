
const { Builder, By, Key, until } = require('selenium-webdriver');

async function testLogin() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:3000/login');

        const usernameField = await driver.findElement(By.xpath('/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/input[1]'));

        await usernameField.sendKeys('admin');

        await driver.findElement(By.xpath('/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/input[2]')).sendKeys('admin123', Key.RETURN);

        let loginButton = driver.findElement(By.xpath("/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/button"));
        loginButton.click()

        await Promise.race([
            driver.wait(until.urlIs('http://localhost:3000/'), 5000),
            driver.wait(until.urlIs('http://localhost:3000/login/'), 5000)
        ]);

        //await driver.wait(until.urlIs('http://localhost:3000/'), 5000);



        const pageTitle = await driver.getCurrentUrl();
        if (pageTitle != 'http://localhost:3000/login') {
            console.log('%s','✅ ','Login test passed!');
        } else {
            console.log(pageTitle)
            console.log('%s','❌ ','Login test failed!');
        }
    } finally {
        await driver.quit();
    }
}

async function uploadDialogShow() {
    let driver = await new Builder().forBrowser('chrome').build();
    driver.manage().window().setRect({width: 1500, height: 1000});
    try {
        await driver.get('http://localhost:3000/login');

        const usernameField = await driver.findElement(By.xpath('/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/input[1]'));

        await usernameField.sendKeys('admin');

        await driver.findElement(By.xpath('/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/input[2]')).sendKeys('admin123');



        let loginButton = driver.findElement(By.xpath("/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/button"));
        loginButton.click()

        await driver.wait(until.urlIs('http://localhost:3000/'), 5000);

        //await new Promise(resolve => setTimeout(resolve, 5000));
        let uploadButton = driver.findElement(By.xpath('/html/body/div[2]/div[2]/div[3]/div/div/div/div[2]'));
        uploadButton.click()

        await driver.wait(until.urlIs('http://localhost:3000/'), 5000);


        //let uploadDialog = driver.findElement(By.xpath('/html/body/div[1]/div[2]'));
        //await driver.wait(until.elementLocated(uploadDialog), 10000 );
        //uploadDialogLocator.click()

        const modalLocator = By.css('.modal');
        const modalElement = await driver.wait(until.elementLocated(modalLocator), 10000);




        console.log('%s','✅ ','Upload dialog show test passed!');
    } catch (error) {
        console.log('%s','❌ ','Upload dialog show test failed!');

    } finally {
        await driver.quit();
    }
}

async function testWrongPasswordLogin() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:3000/login');

        const usernameField = await driver.findElement(By.xpath('/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/input[1]'));

        await usernameField.sendKeys('admin');

        await driver.findElement(By.xpath('/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/input[2]')).sendKeys('admin123');

        let loginButton = driver.findElement(By.xpath("/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/button"));
        loginButton.click()
        await driver.wait(until.urlIs('http://localhost:3000/login'), 5000);

        //const notificationLocator = By.css('.notification-message');
        const notificationLocator = By.xpath('/html/body/div[2]/div[1]/div/div/div');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const notificationElement = await driver.wait(
            until.elementLocated(notificationLocator),
            10000
        );

        const notificationText = await notificationElement.getText();
        const expectedContent = 'Wrong password';
        if (notificationText.includes(expectedContent)) {
            console.log('%s','✅ ','Wrong password test passed!');
        } else {
            console.log('%s','❌ ','Wrong password test failed!');
        }


    } finally {
        await driver.quit();
    }
}

async function testWrongUsernameLogin() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:3000/login');

        const usernameField = await driver.findElement(By.xpath('/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/input[1]'));

        await usernameField.sendKeys('admin77');

        await driver.findElement(By.xpath('/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/input[2]')).sendKeys('admin123');

        let loginButton = driver.findElement(By.xpath("/html/body/div[2]/div[2]/div/div[2]/div/div[1]/div[2]/form/button"));
        loginButton.click()
        await driver.wait(until.urlIs('http://localhost:3000/login'), 5000);

        //const notificationLocator = By.css('.notification-message');
        const notificationLocator = By.xpath('/html/body/div[2]/div[1]/div/div/div');
        await new Promise(resolve => setTimeout(resolve, 1000));

        const notificationElement = await driver.wait(
            until.elementLocated(notificationLocator),
            10000
        );

        const notificationText = await notificationElement.getText();
        const expectedContent = 'Wrong username';
        if (notificationText.includes(expectedContent)) {
            console.log('%s','✅ ','Wrong username test passed!');
        } else {
            console.log('%s','❌ ','Wrong username test failed!');
        }


    } finally {
        await driver.quit();
    }
}

testWrongPasswordLogin();
testWrongUsernameLogin();
uploadDialogShow();
testLogin();


