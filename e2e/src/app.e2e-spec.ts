import { AppPage } from './app.po';
import { browser, protractor } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should navigate to page', () => {
    page.navigateTo();
    const searchInputElement = page.getSearchInputElement();
    expect(searchInputElement.getAttribute('placeholder')).toEqual('Search gifs');
  });

  it('should insert the text to the input and search', () => {
    const searchInputElement = page.getSearchInputElement();
    searchInputElement.sendKeys('test');
    browser.wait(searchInputElement.sendKeys(protractor.Key.ENTER));

    // check tag
    expect(page.getElementByClassName('tag').getText()).toContain('test');

    // check items
    page.getElementsByClassName('card-img-top').count().then(length => {
      expect(length).toEqual(9);
    });

    // check pagination
    page.getElementByTag('ngb-pagination').isPresent().then(isPresent => {
      expect(isPresent).toBeTruthy();
    });

    browser.sleep(500);
  });

  it('should change pagination', () => {
    const prevValue = page.getElementByClassName('card-img-top').getAttribute('src');
    browser.wait(
      page.getElementsByClassName('page-link').get(2).click()
    );
    browser.sleep(500);
    const changedValue = page.getElementByClassName('card-img-top').getAttribute('src');
    expect(changedValue).not.toEqual(prevValue);
  });

  it('should clear search', () => {
    const searchInputElement = page.getSearchInputElement();
    browser.wait(page.getElementByClassName('remove-tags').click());
    browser.sleep(500);
    expect(searchInputElement.getAttribute('value')).toEqual('');
  });

  it('should insert the text to the input and search empty result', () => {
    const searchInputElement = page.getSearchInputElement();
    searchInputElement.sendKeys('########################################################################################');
    browser.wait(searchInputElement.sendKeys(protractor.Key.ENTER));
    browser.sleep(500);
    expect(page.getElementByClassName('alert').getText()).toEqual('No matches found, please try some different terms.');
  });

});
