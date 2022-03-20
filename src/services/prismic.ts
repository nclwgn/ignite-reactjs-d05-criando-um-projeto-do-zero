import * as prismic from '@prismicio/client';

const endpoint = prismic.getRepositoryEndpoint(process.env.PRISMIC_REPOSITORY_NAME);

export const client = prismic.createClient(endpoint, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
});

export function getPrismicClient() {
  return client;
}
