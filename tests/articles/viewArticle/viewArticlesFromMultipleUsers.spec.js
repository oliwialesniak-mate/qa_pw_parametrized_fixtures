import { test } from '../../_fixtures/fixtures';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';

test.use({ contextsNumber: 3, usersNumber: 3 });

test.beforeEach(async ({ pages, users, logger }) => {
  // Sign up three distinct users
  await signUpUser(pages[0], users[0]);
  await signUpUser(pages[1], users[1]);
  await signUpUser(pages[2], users[2]);

  // Each user creates a unique article
  const article1 = generateNewArticleData(logger);
  article1.title += ' by user1';
  await createArticle(pages[0], article1);

  const article2 = generateNewArticleData(logger);
  article2.title += ' by user2';
  await createArticle(pages[1], article2);

  // Store on test context for use in the test
  test.info().annotations.push({
    type: 'articles',
    description: JSON.stringify([article1, article2]),
  });
});

test('User can see in feed articles from two different users', async ({
  pages,
  users,
  homePage,
}) => {
  await homePage.open();

  // Retrieve articles from annotations
  const annotation = test.info().annotations.find(a => a.type === 'articles');
  const [article1, article2] = JSON.parse(annotation.description);

  await homePage.assertArticleVisible(article1.title, users[0].username);
  await homePage.assertArticleVisible(article2.title, users[1].username);
});
