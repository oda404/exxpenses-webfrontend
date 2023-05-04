import { ApolloQueryResult } from '@apollo/client'
import { Box, Button } from '@mui/material'
import type { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Topbar from '../components/Topbar'
import { User, UserGetDocument, UserGetQuery } from '../generated/graphql'
import apolloClient from '../utils/apollo-client'
import Footer from '../components/Footer'
import BigLogo from '../components/BigLogo'

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function NumberCircle({ n }: { n: number; }) {
  return (
    <Box
      marginRight="20px"
      minWidth="40px"
      minHeight="40px"
      width="40px"
      height="40px"
      sx={{
        borderRadius: "100px"
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      bgcolor="var(--exxpenses-second-bg-color)"
    >
      <Box textAlign="center" fontSize="24px" color="#888888">
        {n}
      </Box>
    </Box >
  )
}

function IndexContent() {
  return (
    <Box
      width="100%"
      alignItems="center"
      flexDirection="column"
      display="flex"
      sx={{ minHeight: "100vh" }}
    >
      <Box
        bgcolor="var(--exxpenses-second-bg-color)"
        color="white"
        fontFamily="'Work Sans', sans-serif"
        fontSize="38px"
        display="flex"
        alignItems="center"
        flexDirection="column"
        width="100%"
        paddingY="70px"
      >
        <Box paddingX="20px" maxWidth="990px" width="100%">
          <Box fontWeight="bold" color="#eeeeee">
            Start tracking your
          </Box>
          <Box display="flex">
            <Box>
              <BigLogo />
            </Box>
            <Box fontWeight="bold" color="#eeeeee">
              &nbsp;like a pro
            </Box>
          </Box>
          <Box fontSize="20px">
            &#34;If you don&#39;t get serious about your money, you will never have serious money.&#34;
          </Box>
          <Button sx={{ marginTop: "20px" }} href="/register" className="fullButton">
            Sign up
          </Button>
        </Box>
      </Box>

      <Box padding="20px" paddingX="10px" maxWidth="990px" width="100%">
        <Box fontFamily="'Work Sans', sans-serif" fontSize="24px">
          The Exxpenses workflow
        </Box>

        <Box display="flex" marginTop="20px">
          <NumberCircle n={1} />
          <Box>
            <Box fontSize="18px" width="100%" display="flex">
              <b>Track your expenses</b>
            </Box>
            <Box marginLeft="20px">
              After spending money, track that expenses in it&#39;s category. Tracking your expenses also helps create a stronger conscience about what you spend your money on!
            </Box>
          </Box>
        </Box>

        <Box display="flex" marginTop="20px">
          <NumberCircle n={2} />
          <Box>
            <Box fontSize="18px" width="100%" display="flex">
              <b>Get insight</b>
            </Box>
            <Box marginLeft="20px">
              At any point you can get insight on your monthly spendings and compare them with last month&#39;s.
            </Box>
          </Box>
        </Box>

        <Box display="flex" marginTop="20px">
          <NumberCircle n={3} />
          <Box>
            <Box fontSize="18px" width="100%" display="flex">
              <b>Cut down on unnedeed expenses</b>
            </Box>
            <Box marginLeft="20px">
              Identify and cut down on unneeded or otherwise excesive monthly spendings.
            </Box>
          </Box>
        </Box>
      </Box>
    </Box >
  )
}

export default function Home({ ssr }: HomeProps) {

  return (
    <Box bgcolor="var(--exxpenses-main-bg-color)" position="relative" minWidth="100%" minHeight="100vh">
      <Head>
        <title>Track your day-to-day expenses - Exxpenses</title>
        <meta
          name="description"
          content="Track your day-to-day expenses."
          key="desc"
        />
      </Head>

      <Box>
        <Topbar user={ssr.userGet.user ? ssr.userGet.user as User : undefined} />
        <Box>
          <IndexContent />
          <Footer />
        </Box>
      </Box>
    </Box >
  )
}

export async function getServerSideProps({ req }: any) {
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
        userGet: userGet
      }
    }
  }
}
