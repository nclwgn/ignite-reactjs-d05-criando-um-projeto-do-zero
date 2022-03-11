import { GetStaticProps } from 'next';
import { Head } from 'next/document';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home() {
  return (
    <div className={styles.container}>
      <a>
        <h1>Como utilizar Hooks</h1>
        <p>Pensando em sincronização em vez de ciclos de vida.</p>
        <time>15 Mar 2021</time>
        <span>Joseph Oliveira</span>
      </a>

      <a>
        <h1>Como utilizar Hooks</h1>
        <p>Pensando em sincronização em vez de ciclos de vida.</p>
        <time>15 Mar 2021</time>
        <span>Joseph Oliveira</span>
      </a>

      <a>
        <h1>Como utilizar Hooks</h1>
        <p>Pensando em sincronização em vez de ciclos de vida.</p>
        <time>15 Mar 2021</time>
        <span>Joseph Oliveira</span>
      </a>

      <a>
        <h1>Como utilizar Hooks</h1>
        <p>Pensando em sincronização em vez de ciclos de vida.</p>
        <time>15 Mar 2021</time>
        <span>Joseph Oliveira</span>
      </a>
    </div>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
