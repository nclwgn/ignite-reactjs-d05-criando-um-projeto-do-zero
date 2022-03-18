import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
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
  console.log(post);

  return (
    <>
      <Head>
        <title>{post.data.title} - spacetraveling</title>
      </Head>
      <article>
        <img className={styles.banner} src={post.data.banner.url} />
        <div className={`${commonStyles.contentContainer} ${styles.content}`}>
          <header>{post.data.title}</header>
          <div className={commonStyles.postInfoContainer}>
            <time><FiCalendar size={20} />{post.first_publication_date}</time>
            <span><FiUser size={20} />{post.data.author}</span>
            <span><FiClock />TODO: estimated reading time</span>
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
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking'
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const response = await prismicClient.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
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
