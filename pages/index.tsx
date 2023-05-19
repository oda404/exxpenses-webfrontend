import { Box, Button } from '@mui/material'
import type { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Topbar from '../components/Topbar'
import Footer from '../components/Footer'
import BigLogo from '../components/BigLogo'
import userGet from '../gql/ssr/userGet'
import Image from 'next/image'
import useShowMobileView from '../utils/useShowMobileView'

type HomeProps = InferGetServerSidePropsType<typeof getServerSideProps>;

function NumberCircle({ n }: { n: number; }) {
  return (
    <Box
      minWidth="40px"
      minHeight="40px"
      width="40px"
      marginX="12px"
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
      <Box textAlign="center" fontSize="24px" color="var(--exxpenses-lighter-green)">
        {n}
      </Box>
    </Box >
  )
}

function IndexContent() {

  const isMobileView = useShowMobileView();

  let wfcont: any;
  if (isMobileView) {
    wfcont = (
      <Box>
        <Box alignItems="center" display="flex" marginTop="20px">
          <NumberCircle n={1} />
          <Box>
            <Box fontWeight="bold" color="var(--exxpenses-light-green)" fontSize="18px" width="100%">
              Set Up Categories
            </Box>
            <Box width="100%">
              Customize your expense categories based on your spending habits. Create categories like groceries, bills, entertainment, etc.
            </Box>
          </Box>
        </Box>

        <Box marginLeft="32px" height="30px" width="1px" bgcolor="var(--exxpenses-light-green)" />

        <Box display="flex" alignItems="center" marginTop="20px">
          <NumberCircle n={2} />
          <Box>
            <Box fontWeight="bold" color="var(--exxpenses-light-green)" fontSize="18px" width="100%">
              Record Expenses
            </Box>
            <Box width="100%">
              Whenever you make a purchase, log it in Exxpenses. Just enter the amount, and the appropriate category!
            </Box>
          </Box>
        </Box>

        <Box marginLeft="32px" height="30px" width="1px" bgcolor="var(--exxpenses-light-green)" />

        <Box alignItems="center" display="flex" marginTop="20px">
          <NumberCircle n={3} />
          <Box>
            <Box fontWeight="bold" color="var(--exxpenses-light-green)" fontSize="18px" width="100%">
              Analyze Spending Patterns
            </Box>
            <Box width="100%">
              Exxpenses provides insightful analytics to help you understand your spending habits. Dive into graphs, charts, and more!
            </Box>
          </Box>
        </Box>

        <Box marginLeft="32px" height="30px" width="1px" bgcolor="var(--exxpenses-light-green)" />

        <Box alignItems="center" display="flex" marginTop="20px">
          <NumberCircle n={4} />
          <Box>
            <Box fontWeight="bold" color="var(--exxpenses-light-green)" fontSize="18px" width="100%">
              Set Budgets
            </Box>
            <Box width="100%">
              Take control of your finances by setting monthly or weekly budgets for different expense categories.
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
  else {
    wfcont = (
      <>
        <Box alignItems="center" display="flex" marginTop="20px">
          <Box fontWeight="bold" color="var(--exxpenses-light-green)" textAlign="right" fontSize="18px" width="100%">
            Set Up Categories
          </Box>
          <NumberCircle n={1} />
          <Box width="100%">
            Customize your expense categories based on your spending habits. Create categories like groceries, bills, entertainment, etc.
          </Box>
        </Box>

        <Box height="30px" width="1px" bgcolor="var(--exxpenses-light-green)" />

        <Box display="flex" alignItems="center" marginTop="20px">
          <Box fontWeight="bold" color="var(--exxpenses-light-green)" textAlign="right" fontSize="18px" width="100%">
            Record Expenses
          </Box>
          <NumberCircle n={2} />
          <Box width="100%">
            Whenever you make a purchase, log it in Exxpenses. Just enter the amount, and the appropriate category!
          </Box>
        </Box>

        <Box height="30px" width="1px" bgcolor="var(--exxpenses-light-green)" />

        <Box alignItems="center" display="flex" marginTop="20px">
          <Box fontWeight="bold" color="var(--exxpenses-light-green)" textAlign="right" fontSize="18px" width="100%">
            Analyze Spending Patterns
          </Box>
          <NumberCircle n={3} />
          <Box width="100%">
            Exxpenses provides insightful analytics to help you understand your spending habits. Dive into graphs, charts, and more!
          </Box>
        </Box>

        <Box height="30px" width="1px" bgcolor="var(--exxpenses-light-green)" />

        <Box alignItems="center" display="flex" marginTop="20px">
          <Box fontWeight="bold" color="var(--exxpenses-light-green)" textAlign="right" fontSize="18px" width="100%">
            Set Budgets
          </Box>
          <NumberCircle n={4} />
          <Box width="100%">
            Take control of your finances by setting monthly or weekly budgets for different expense categories.
          </Box>
        </Box>
      </>
    )
  }

  let mobcont: any;
  if (isMobileView) {
    mobcont = (
      <Box marginBottom="20px" width="100%" position="relative" display="flex" flexDirection="column" alignItems="center">
        <Image style={{ zIndex: "4" }} src="/pix5.png" width={246} height={456} alt="Phone" />
        <Box borderRadius="10px" zIndex="0" top="228px" position="absolute" bgcolor="var(--exxpenses-second-bg-color)" width="100%" height="505px" />
        <Box zIndex="4">
          <Box >
            <Box fontWeight="bold" fontSize="16px" color="var(--exxpenses-light-green)">
              Made for everyone
            </Box>
            <Box fontSize="14px">
              Built by normal people for normal people.
            </Box>
          </Box>
          <Box marginY="20px" />
          <Box>
            <Box fontWeight="bold" fontSize="16px" color="var(--exxpenses-light-green)">
              Mobile Compatible
            </Box>
            <Box fontSize="14px">
              Track your expenses anywhere you are!
            </Box>
          </Box>
          <Box marginY="20px" />
          <Box>
            <Box fontWeight="bold" fontSize="16px" color="var(--exxpenses-light-green)">
              Multi-currency
            </Box>
            <Box fontSize="14px">
              Track multi-currency expenses at any time.
            </Box>
          </Box>
          <Box marginY="20px" />
          <Box>
            <Box fontWeight="bold" fontSize="16px" color="var(--exxpenses-light-green)">
              Instant feedback
            </Box>
            <Box fontSize="14px">
              Get immediate statistics on every expense.
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
  else {
    mobcont = (
      <Box position="relative" display="flex">
        <Box marginTop="155px" paddingLeft="20px" zIndex="4" display="flex" flexDirection="column">
          <Box>
            <Box textAlign="right" fontWeight="bold" fontSize="16px" color="var(--exxpenses-light-green)">
              Made for everyone
            </Box>
            <Box textAlign="right" fontSize="14px">
              Built by normal people for normal people.
            </Box>
          </Box>
          <Box marginY="20px" />
          <Box>
            <Box textAlign="right" fontWeight="bold" fontSize="16px" color="var(--exxpenses-light-green)">
              Mobile Compatible
            </Box>
            <Box textAlign="right" fontSize="14px">
              Track your expenses anywhere you are!
            </Box>
          </Box>
        </Box>
        <Image style={{ zIndex: "4" }} src="/pix5.png" width={246} height={456} alt="Phone" />
        <Box marginTop="155px" zIndex="4" paddingRight="20px" display="flex" flexDirection="column">
          <Box>
            <Box fontWeight="bold" fontSize="16px" color="var(--exxpenses-light-green)">
              Multi-currency
            </Box>
            <Box fontSize="14px">
              Track multi-currency expenses at any time.
            </Box>
          </Box>
          <Box marginY="20px" />
          <Box>
            <Box fontWeight="bold" fontSize="16px" color="var(--exxpenses-light-green)">
              Instant feedback
            </Box>
            <Box fontSize="14px">
              Get immediate statistics on every expense.
            </Box>
          </Box>
        </Box>
        <Box borderRadius="10px" zIndex="0" top="228px" position="absolute" bgcolor="var(--exxpenses-second-bg-color)" width="100%" height="228px" />
      </Box>
    );
  }

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
        fontSize="34px"
        display="flex"
        alignItems="center"
        flexDirection="column"
        width="100%"
        paddingY="50px"
      >
        <Box paddingX="20px" maxWidth="990px" width="100%">
          <Box fontWeight="bold" color="#eeeeee">
            Start tracking your
          </Box>
          <Box display="flex">
            <Box>
              <BigLogo width={160} height={50} />
            </Box>
            <Box fontWeight="bold" color="#eeeeee">
              &nbsp;like a pro
            </Box>
          </Box>
          <Box fontSize="16px">
            Welcome to Exxpenses, your ultimate platform for effortless expense tracking, management, and valuable insights. With Exxpenses, you can take control of your day-to-day spending like never before.
          </Box>
          <Button sx={{ width: "fit-content !important", marginTop: "20px" }} href="/register" className="fullButton">
            Get started!
          </Button>
        </Box>
      </Box>

      <Box textAlign="center" marginTop="30px" fontFamily="'Work Sans', sans-serif" fontSize="24px">
        The easiest way to track your expenses
      </Box>
      {mobcont}

      <Box display="flex" flexDirection="column" alignItems="center" padding="20px" paddingX="10px" maxWidth="990px" width="100%">
        <Box fontFamily="'Work Sans', sans-serif" fontSize="24px">
          The Exxpenses workflow
        </Box>
        {wfcont}
      </Box>
    </Box >
  )
}

export default function Home({ }: HomeProps) {

  return (
    <Box bgcolor="var(--exxpenses-main-bg-color)" position="relative" minWidth="100%" minHeight="100vh">
      <Head>
        <title>Day-to-Day Expenses Management Tool | Exxpenses</title>
        <meta
          name="description"
          content="Track, manage and cut down on day-to-day expenses with Exxpenses. Multi-currency."
          key="desc"
        />
      </Head>

      <Box>
        <Topbar user={undefined} />
        <Box>
          <IndexContent />
          <Footer />
        </Box>
      </Box>
    </Box >
  )
}

export async function getServerSideProps({ req }: any) {
  const userData = await userGet(req);

  if (userData.user) {
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
      }
    }
  }
}
