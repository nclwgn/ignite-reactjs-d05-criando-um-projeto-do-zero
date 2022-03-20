import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { useMemo } from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { client as prismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const readingTime = useMemo(() => {
    if (!post)
      return 0;

    const wordCount = post.data.content.reduce((previousCount, content) => {
      const headingWordCount = content.heading.split('[\s.]+').length;
      const bodyWordCount = RichText.asText(content.body).split('[\s.]+').length;

      return previousCount + headingWordCount + bodyWordCount;
    }, 0);

    return Math.floor(wordCount / 200) + 1;
  }, [post]);

  return (
    <>
      <Head>
        <title>{post?.data.title} - spacetraveling</title>
      </Head>
      {!post
        ? (
          <div className={`${commonStyles.contentContainer} ${styles.content}`}>
            Carregando....
          </div>
        )
        : (
          <article>
            <img className={styles.banner} src={post.data.banner.url} />
            <div className={`${commonStyles.contentContainer} ${styles.content}`}>
              <header>{post.data.title}</header>
              <div className={commonStyles.postInfoContainer}>
                <time><FiCalendar size={20} />{post.first_publication_date}</time>
                <span><FiUser size={20} />{post.data.author}</span>
                <span><FiClock />{readingTime}</span>
              </div>
              <main className={commonStyles.writtenContent}>
                {post.data.content.map(contentPiece => (
                  <>
                    <h1>{contentPiece.heading}</h1>
                    <div dangerouslySetInnerHTML={{ __html: RichText.asHtml(contentPiece.body) }} />
                  </>
                ))}
              </main>
            </div>
          </article>
        )
      }
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true
});

const months = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'
];

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const response = await prismicClient.getByUID('posts', String(slug), {});

  const firstPublicationDate = new Date(response.first_publication_date);

  const formattedDate = `${firstPublicationDate.getDay()} ${months[firstPublicationDate.getMonth()]} ${firstPublicationDate.getFullYear()}`;

  const post = {
    first_publication_date: formattedDate,
    data: {
      title: RichText.asText(response.data.title),
      banner: {
        url: response.data.banner.url
      },
      author: RichText.asText(response.data.author),
      content: response.data.content
    }
  };

  return {
    props: {
      post
    },
    revalidate: 60 * 30 // 30 minutes
  }
};
