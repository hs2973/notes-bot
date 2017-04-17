import { NotesBotPage } from './app.po';

describe('notes-bot App', () => {
  let page: NotesBotPage;

  beforeEach(() => {
    page = new NotesBotPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
