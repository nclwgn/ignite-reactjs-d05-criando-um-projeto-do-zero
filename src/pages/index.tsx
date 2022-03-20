import next, { GetStaticProps } from 'next';
import * as prismic from '@prismicio/client';
import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { client } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination: { next_page, results } }: HomeProps) {
  const [postData, setPostData] = useState<Post[]>(results);
  const [nextPageFetchLink, setNextPageFetchLink] = useState<string>(next_page);

  async function handleFetchMoreClick() {
    try {
      if (!nextPageFetchLink) {
        console.log('There are no more posts to be loaded');
        return;
      }

      fetch(nextPageFetchLink)
        .then(async response => {
          const prismicResponse: PostPagination = await response.json();

          setNextPageFetchLink(prismicResponse.next_page);

          const newPostData: Post[] = prismicResponse.results.map(post => ({
            uid: post.uid,
            first_publication_date: new Date(post.first_publication_date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            }),
            data: {
              title: RichText.asText(post.data.title),
              subtitle: RichText.asText(post.data.subtitle),
              author: RichText.asText(post.data.author)
            }
          }));

          setPostData(postData.concat(newPostData));
        })
        .catch(error => {
          console.log('Some problem happened when fetching posts from Prismic API', error);
        });
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <div className={`${styles.container} ${commonStyles.contentContainer}`}>
        {postData.map(post => (
          <Link href={`/post/${post.uid}`}>
            <article key={post.uid}>
              <header>{post.data.title}</header>
              <p>{post.data.subtitle}</p>

              <footer>
                <time><FiCalendar size={20}/>{post.first_publication_date}</time>
                <span><FiUser size={20}/>{post.data.author}</span>
              </footer>
            </article>
          </Link>
        ))}

        {!!nextPageFetchLink
          && (
            <p
              className={styles.loadMore}
              onClick={handleFetchMoreClick}
            >
              Carregar mais posts
            </p>
          )
        }
      </div>
    </>
  )
}

const months = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'
];

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const prismicClient = client;

  const response = await prismicClient.get({
    predicates: prismic.predicate.at('document.type', 'posts'),
    fetch: ['post.title', 'author.name'],
    pageSize: 5
  });


  const posts: Post[] = response.results.map(post => {
    const firstPublicationDate = new Date(post.first_publication_date);

    const formattedDate = `${firstPublicationDate.getDay()} ${months[firstPublicationDate.getMonth()]} ${firstPublicationDate.getFullYear()}`;

    return {
      uid: post.uid,
      first_publication_date: formattedDate,
      data: {
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.subtitle),
        author: RichText.asText(post.data.author)
      }
    }
  });

  return {
    props: {
      postsPagination: {
      next_page: response.next_page,
      results: posts
  }}};
};
