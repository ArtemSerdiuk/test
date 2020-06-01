import { browser, by, element, ElementArrayFinder, ElementFinder } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl + '/gif-search/') as Promise<unknown>;
  }

  getSearchInputElement(): ElementFinder {
    return element(by.className('tag-input-text'));
  }

  getElementByClassName(className: string): ElementFinder {
    return element(by.className(className));
  }

  getElementByTag(tagName: string): ElementFinder {
    return element(by.tagName(tagName));
  }

  getElementsByClassName(className: string): ElementArrayFinder {
    return element.all(by.className(className));
  }
}
