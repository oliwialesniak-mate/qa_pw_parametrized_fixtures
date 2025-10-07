import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';

test.use({ contextsNumber: 3, usersNumber: 3 });

test.beforeEach(async ({ pages, users, articleWithoutTags }) => {
  // Sign up and create articles for user 1 and user 2
  await signUpUser(pages[0], users[0], 1);
  await signUpUser(pages[1], users[1], 2);
  await signUpUser(pages[2], users[2], 3);

  await createArticle(pages[0], articleWithoutTags, 1);
  await createArticle(pages[1], articleWithoutTags, 2);
});

test('User can see in feed articles from two different users', async ({
  pages,
  users,
  homePage,
  articleWithoutTags,
}) => {
  // User 3 views feed
  await homePage.open(pages[2], 3);

  await homePage.assertArticleVisible(articleWithoutTags.title, users[0].username);
  await homePage.assertArticleVisible(articleWithoutTags.title, users[1].username);
});
