import { ApolloQueryResult } from '@apollo/client'
import { Box } from '@mui/material'
import type { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Navbar from '../components/navbar'
import { UserGetDocument, UserGetQuery } from '../generated/graphql'
import apolloClient from '../utils/apollo-client'

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Home({ ssr }: HomeProps) {

  return (
    <Box width="100vw" height="100vh" bgcolor="var(--exxpenses-main-bg-color)">
      <Head>
        <title>Exxpenses</title>
        <meta
          name="description"
          content="Track your day-to-day expenses."
          key="desc"
        />
      </Head>
    </Box>
  )
}

export async function getServerSideProps({ req, res }: any) {
  const { data: { userGet } }: ApolloQueryResult<UserGetQuery> = await apolloClient.query({
    query: UserGetDocument,
    context: { cookie: req.headers.cookie },
    fetchPolicy: "no-cache"
  });

  if (userGet.user) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard"
      }
    }
  }

  return {
    props: {
      ssr: {
        userResponse: userGet

      }
    }
  }
}
