import { test } from '../../_fixtures/fixtures';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';

const testParameters = [
  { tagsNumber: 1, testNameEnding: 'one tag' },
  { tagsNumber: 2, testNameEnding: 'two tags' },
  { tagsNumber: 5, testNameEnding: 'five tags' },
];

testParameters.forEach(({ tagsNumber, testNameEnding }) => {
  test.describe('Edit article tags', () => {
    let taggedArticle;

    test.beforeEach(async ({ page, user, logger }) => {
      // Sign up and create an article that already has tags
      await signUpUser(page, user);
      taggedArticle = generateNewArticleData(logger, tagsNumber);
      await createArticle(page, taggedArticle);
    });

    test(`User can remove all tags from previously created article with ${testNameEnding}`, async ({
      createArticlePage,
      viewArticlePage,
      homePage,
    }) => {
      await homePage.open();
      await homePage.openArticle(taggedArticle.title);

      await viewArticlePage.clickEdit();
      await createArticlePage.removeAllTags();
      await createArticlePage.clickPublishArticleButton();

      await viewArticlePage.assertNoTagsVisible();
    });

    test(`User can add tags on edit to previously created article with ${testNameEnding}`, async ({
      createArticlePage,
      viewArticlePage,
      homePage,
      logger,
    }) => {
      const updatedArticle = generateNewArticleData(logger, tagsNumber);
      await homePage.open();
      await homePage.openArticle(taggedArticle.title);

      await viewArticlePage.clickEdit();
      await createArticlePage.fillTagsField(updatedArticle.tags);
      await createArticlePage.clickPublishArticleButton();

      await viewArticlePage.assertArticleTagsAreVisible(updatedArticle.tags);
    });
  });
});
