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
    test.beforeEach(async ({ page, user, articleWithoutTags }) => {
      await signUpUser(page, user);
      await createArticle(page, articleWithoutTags);
    });

    test(`User can remove all tags from previously created article with ${testNameEnding}`, async ({
      createArticlePage,
      viewArticlePage,
      homePage,
      articleWithoutTags,
    }) => {
      await homePage.open();
      await homePage.openArticle(articleWithoutTags.title);

      await viewArticlePage.clickEdit(); // critical missing step
      await createArticlePage.removeAllTags();
      await createArticlePage.clickPublishArticleButton();

      await viewArticlePage.assertNoTagsVisible();
    });

    test(`User can add tags on edit to previously created article with ${testNameEnding}`, async ({
      createArticlePage,
      viewArticlePage,
      homePage,
      articleWithoutTags,
      logger,
    }) => {
      const article = generateNewArticleData(logger, tagsNumber);
      await homePage.open();
      await homePage.openArticle(articleWithoutTags.title);

      await viewArticlePage.clickEdit(); // open edit form
      await createArticlePage.fillTagsField(article.tags);
      await createArticlePage.clickPublishArticleButton();

      await viewArticlePage.assertArticleTagsAreVisible(article.tags);
    });
  });
});
