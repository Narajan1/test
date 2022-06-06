const assert = require("assert");
const should = require('chai').should();
const expectChai = require('chai').expect;

describe("Verify all page functionality", () => {
    before(async () => {
        await browser.url("https://www.rahulshettyacademy.com/AutomationPractice/");
        await browser.maximizeWindow();
        require('expect-webdriverio').setOptions({ wait: 5000 });
    });

    it("should check url", async () => {
        await expect(browser).toHaveUrl("https://www.rahulshettyacademy.com/AutomationPractice/");
    });

    it("should check title", async () => {
        await expect(browser).toHaveTitleContaining("Practice Page");
    });

    it("should check radio buttons functionality", async () => {
        const arr_radio = await $$(".radioButton");
        const rndNum = Math.floor(Math.random() * arr_radio.length);
        await arr_radio[rndNum].click();
        expectChai(await arr_radio[rndNum].isSelected()).to.be.true;

    });

    //This test should be written by function for automation the random input letters
    it("should check Autosuggession field functionality", async () => {
        const inputField = await $("input[placeholder='Type to Select Countries']");
        await inputField.setValue("ar");
        const allAutocompleteValues = await $$("//ul[@id='ui-id-1']//li//div[@class='ui-menu-item-wrapper']");

        for (let i = 0; i < allAutocompleteValues.length; i++) {
            await expect(allAutocompleteValues[i]).toHaveTextContaining('ar', { ignoreCase: true })
        };

        //Սա ուղղակի գրել եմ, որ Armenia ընտրի :)
        for (let i = 0; i < allAutocompleteValues.length; i++) {
            const value = await allAutocompleteValues[i].getText();
            if (value.includes("Armenia")) {
                await allAutocompleteValues[i].click();
            };
        };
    });

    it("should select DropDown options", async () => {
        const arr_options = await $$("#dropdown-class-example option");
        const rndNum = Math.round((Math.random() * (arr_options.length-1)));
        const dropDownMenu = await $("#dropdown-class-example");
        await dropDownMenu.click();
        await dropDownMenu.selectByIndex(rndNum);
        expectChai(await arr_options[rndNum].isDisplayed()).to.be.true;
    });

    //A function should be written here to get an argument on how many checkboxes to click on
    it("should check checkbox field functionality", async () => {
        const checkboxes = await $$("#checkbox-example label input[type='checkbox']");
        const rndNum = Math.floor(Math.random() * checkboxes.length);
        await checkboxes[rndNum].click();
        await expect(checkboxes[rndNum]).toBeSelected();
    });

    it("Switch Window Example", async () => {
        await browser.url("https://www.rahulshettyacademy.com/AutomationPractice/");
        await browser.maximizeWindow();
        await (await $("#openwindow")).click();
        await browser.switchWindow("qaclickacademy.com/");
        const noThanksBtn = await $("//div[@class='sumome-react-wysiwyg-move-handle']//button[text()='NO THANKS']");
        await noThanksBtn.isEnabled();
        await noThanksBtn.click();
        await expect(browser).toHaveTitleContaining("QA Click Academy");
        await browser.closeWindow();
        await browser.switchWindow("Practice Page");
        await expect(browser).toHaveTitleContaining("Practice Page");   
    });

    it("Switch Tab Example", async () => {
        await (await $("//a[@id='opentab']")).click();
        await browser.switchWindow("Rahul Shetty Academy");
        const pageElText = await(await $("//span[contains(text(), 'World class Tutorials on Selenium')]")).getText();
        await pageElText.should.contains("World class Tutorials on Selenium");
        await browser.closeWindow();
        await browser.switchWindow("Practice Page");
        await expect(browser).toHaveTitleContaining("Practice Page");
    });

    it("Switch To Alert Example", async () => {
        await(await $("#alertbtn")).click();
        await browser.isAlertOpen();
        const alertText = await browser.getAlertText();
        assert.equal(alertText, "Hello , share this practice page and share your knowledge");
        await browser.acceptAlert();
        await(await $("#name")).setValue("Nara");
        await(await $("#alertbtn")).click();
        const alertTextNara = await browser.getAlertText();
        assert.equal(alertTextNara, "Hello Nara, share this practice page and share your knowledge");
        await browser.acceptAlert();

        await(await $("#confirmbtn")).click();
        await browser.isAlertOpen();
        const confirmText = await browser.getAlertText();
        assert.equal(confirmText, "Hello , Are you sure you want to confirm?");
        await browser.acceptAlert();
        await(await $("#name")).setValue("Nara");
        await(await $("#confirmbtn")).click();
        const confirmTextNara = await browser.getAlertText();
        assert.equal(confirmTextNara, "Hello Nara, Are you sure you want to confirm?");
        await browser.dismissAlert();
    });

    it("Web Table Example", async () => {
        const table = await $("//table[@id='product' and @class='table-display']");
        await table.isExisting();
        await table.scrollIntoView();
        await browser.pause(3000);
        const rows = await $$("//table[@id='product' and @class='table-display']/tbody/tr");
        assert.deepEqual(rows.length, 11, "error");
        //Եթե ժամանակ լինի ինդեքսներով պետք է անել
        const element = await $("//table[@id='product' and @class='table-display']/tbody/tr[5]/td[3]");
        const price = await element.getText();
        assert.deepEqual(price, 20, "price error");
    });

    it("Element Displayed Example", async () => {
        const showBtn = await $("#show-textbox");
        await showBtn.isClickable();
        await showBtn.click();

        const inputField = await $("#displayed-text");
        await inputField.waitForDisplayed({ timeout: 5000 });
        assert.equal(await inputField.isDisplayed(), true);
        await inputField.setValue("Hello");
        await browser.pause(3000);
        await expect(inputField).toHaveValue('hello', { ignoreCase: true });

        const hideBtn = await $("#hide-textbox");
        await hideBtn.isClickable();
        await hideBtn.click();
        await browser.pause(3000);

        await expect(inputField).toHaveAttribute('style', 'display: none;');
    });

    it("Web Table Fixed header", async () => {
        const tableLegend = await $("//legend[text()='Web Table Fixed header']");
        await tableLegend.scrollIntoView();
        const headers = await $$(".tableFixHead thead tr th");
        
        for(let i=0; i<headers.length; i++){
            const headerPosition = await headers[i].getAttribute("style");
            await headerPosition.should.contains("position: sticky");
        };

        const lastRow = await $(".tableFixHead #product > tbody > tr:nth-child(9)");
        await lastRow.scrollIntoView();
        const nameOfLastRow = await lastRow.getText();
        await nameOfLastRow.should.contains("Smith");
    });

    it("Mouse Hover", async () => {
        const mouseHoverBtn = await $("#mousehover");
        await mouseHoverBtn.scrollIntoView();
        await mouseHoverBtn.moveTo();
        await browser.pause(3000);
        const btns = await $$("//div[@class='mouse-hover-content']//a");
        await btns[0].click();
        await browser.pause(3000);
        await mouseHoverBtn.scrollIntoView();
        await mouseHoverBtn.moveTo();
        await btns[1].click();
        await expect(await (await $("#radio-btn-example > fieldset > legend")).isDisplayed()).toBe(true);
    });

    it("iFrame Example", async () => {
        const iframe = await $("#courses-iframe");
        await iframe.scrollIntoView();
        await iframe.isExisting();
        await iframe.isDisplayed();
        await browser.switchToFrame(iframe);
        const joinNowEl = await $("//a[text()='JOIN NOW']");
        await joinNowEl.scrollIntoView();
        await joinNowEl.isDisplayed();
        await expect(joinNowEl).toBeExisting();
        await browser.switchToParentFrame();
        const logo = await $("a .logoClass");
        await logo.scrollIntoView();
        await expect(logo).toBeExisting();
    });
});
