import { AsvitaPage } from './app.po';

describe('asvita App', () => {
  let page: AsvitaPage;

  beforeEach(() => {
    page = new AsvitaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
