import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser } from 'react-icons/fi';

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
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <div className={styles.container}>
        <article>
          <header>Como utilizar Hooks</header>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>

          <footer>
            <time><FiCalendar size={20}/>15 Mar 2021</time>
            <span><FiUser size={20}/>Joseph Oliveira</span>
          </footer>
        </article>
        <article>
          <header>Como utilizar Hooks</header>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>

          <footer>
            <time><FiCalendar size={20}/>15 Mar 2021</time>
            <span><FiUser size={20}/>Joseph Oliveira</span>
          </footer>
        </article>
        <article>
          <header>Como utilizar Hooks</header>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>

          <footer>
            <time><FiCalendar size={20}/>15 Mar 2021</time>
            <span><FiUser size={20}/>Joseph Oliveira</span>
          </footer>
        </article>

        <p className={styles.loadMore}>Carregar mais posts</p>
      </div>
    </>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
