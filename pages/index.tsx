import { ApolloQueryResult } from '@apollo/client'
import { Box } from '@mui/material'
import type { InferGetServerSidePropsType } from 'next'
import Navbar from '../components/navbar'
import { UserGetDocument, UserGetQuery } from '../generated/graphql'
import apolloClient from '../utils/apollo-client'

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Home({ ssr }: HomeProps) {

  return (
    <Box width="100vw" height="100vh" bgcolor="var(--exxpenses-main-bg-color)">
      <Navbar />
    </Box>
  )
}

export async function getServerSideProps({ req, res }: any) {
  const { data: { userGet } }: ApolloQueryResult<UserGetQuery> = await apolloClient.query({
    query: UserGetDocument,
    context: { cookie: req.headers.cookie }
  });

  if (userGet.user !== undefined && userGet.user !== null) {
    res.writeHead(302, { Location: "/dashboard" })
    res.end();
  }
  return {
    props: {
      ssr: {
        userResponse: userGet

      }
    }
  }
}
