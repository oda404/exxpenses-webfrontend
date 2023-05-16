import Head from "next/head";
import userGet from "../gql/ssr/userGet";
import { Box } from "@mui/material";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import { InferGetServerSidePropsType } from "next";
import { User } from "../generated/graphql";
import CardBox from "../components/CardBox";
import Link from "next/link";

function TOSContent() {
    return (
        <Box>
            <div><strong><span style={{ fontSize: "26px" }}><span data-custom-class="title">TERMS OF SERVICE</span></span></strong></div>
            <p>Our Terms of Service were last updated on 08.05.2023.</p>
            <p>Please read these terms and conditions carefully before using Our Service.</p>

            <br />
            <p><strong>For the purposes of these Terms of Service:</strong></p>
            <Box marginX="40px">
                <ul>
                    {/* <li>
                    <p><strong>"Affiliate"</strong> means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p>
                </li> */}
                    <li>
                        <p><strong>&#34;Account&#34;</strong> means a unique account created for You to access our Service or parts of our Service.</p>
                    </li>
                    <li>
                        <p><strong>&#34;Company&#34;</strong> (referred to as either &#34;the Company&#34;, &#34;We&#34;, &#34;Us&#34; or &#34;Our&#34; in this Agreement) refers to Olaru Alexandru.</p>
                    </li>
                    {/* <li>
                    <p><strong>&#34;Country&#34;</strong> refers to [___COMPANY_COUNTRY___].</p>
                </li> */}
                    <li>
                        <p><strong>&#34;Content&#34;</strong> refers to content such as text, images, or other information that can be posted, uploaded, linked to or otherwise made available by You, regardless of the form of that content.</p>
                    </li>
                    <li>
                        <p><strong>&#34;Device&#34;</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</p>
                    </li>
                    <li>
                        <p><strong>&#34;Feedback&#34;</strong> means feedback, innovations or suggestions sent by You regarding the attributes, performance or features of our Service.</p>
                    </li>
                    <li>
                        <p><strong>&#34;Service&#34;</strong> refers to the Website.</p>
                    </li>
                    <li>
                        <p><strong>&#34;Terms of Service&#34;</strong> (also referred as &#34;Terms&#34; or &#34;Terms of Service&#34;) mean these Terms of Service that form the entire agreement between You and the Company regarding the use of the Service.</p>
                    </li>
                    {/* <li>
                    <p><strong>&#34;Third-party Social Media Service&#34;</strong> means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</p>
                </li> */}
                    <li>
                        <p><strong>&#34;Website&#34;</strong> refers to Exxpenses, accessible from www.exxpenses.com</p>
                    </li>
                    <li>
                        <p><strong>&#34;You&#34;</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
                    </li>
                </ul>
            </Box>

            <br />
            <p><strong>
                Conditions of Use
            </strong></p>
            <p>
                We will provide these services to you, which are subject to the conditions stated below in this document. Every time you visit this website, use its services or make a purchase, you accept the following conditions. This is why we urge you to read them carefully.
            </p>

            <p>
                <strong>
                    Privacy Policy
                </strong>
            </p>
            <p>
                Before you continue using our website we advise you to read our <Link style={{ color: "#4285F4" }} href="/privacy">privacy policy</Link> regarding our user data collection. It will help you better understand our practices.
            </p>

            <p>
                <strong>
                    Copyright
                </strong>
            </p>
            <p>
                Content published on this website (digital downloads, images, texts, graphics, logos) is the property of Exxpenses and/or its content creators and protected by international copyright laws. The entire compilation of the content found on this website is the exclusive property of Exxpenses, with copyright authorship for this compilation by Exxpenses.
            </p>

            <p>
                <strong>
                    Communications
                </strong>
            </p>
            <p>
                The entire communication with us is electronic. Every time you send us an email or visit our website, you are going to be communicating with us. You hereby consent to receive communications from us. If you subscribe to the news on our website, you are going to receive regular emails from us. We will continue to communicate with you by posting news and notices on our website and by sending you emails. You also agree that all notices, disclosures, agreements, and other communications we provide to you electronically meet the legal requirements that such communications be in writing.
            </p>


            <p>
                <strong>
                    Applicable Law
                </strong>
            </p>
            <p>
                By visiting this website, you agree that the laws of Romania without regard to principles of conflict laws, will govern these terms of service, or any dispute of any sort that might come between Exxpenses and you, or its business partners and associates.
            </p>

            <p>
                <strong>
                    Disputes
                </strong>
            </p>
            <p>
                Any dispute related in any way to your visit to this website or to products you purchase from us shall be arbitrated by state or federal court of Romania and you consent to exclusive jurisdiction and venue of such courts.
            </p>

            <p>
                <strong>
                    Comments, Reviews, and Emails
                </strong>
            </p>
            <p>
                Visitors may post content as long as it is not obscene, illegal, defamatory, threatening, infringing of intellectual property rights, invasive of privacy, or injurious in any other way to third parties. Content has to be free of software viruses, political campaigns, and commercial solicitation.
            </p>
            <p>
                We reserve all rights (but not the obligation) to remove and/or edit such content. When you post your content, you grant Exxpenses non-exclusive, royalty-free and irrevocable right to use, reproduce, publish, modify such content throughout the world in any media.
            </p>

            <p>
                <strong>
                    License and Site Access
                </strong>
            </p>
            <p>
                We grant you a limited license to access and make personal use of this website. You are not allowed to download or modify it. This may be done only with written consent from us.
            </p>

            <p>
                <strong>
                    User Account
                </strong>
            </p>
            <p>
                If you are an owner of an account on this website, you are solely responsible for maintaining the confidentiality of your private user details (username and password). You are responsible for all activities that occur under your account or password.
                You consent to us storing any data you provide us through your account registration information, or any type of input into our website.
            </p>
            <p>
                We reserve all rights to terminate accounts, edit or remove content and cancel orders at their sole discretion.
            </p>
        </Box>
    )
}

type TOSProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function TOS({ ssr }: TOSProps) {
    return (
        <Box bgcolor="var(--exxpenses-main-bg-color)" position="relative" minWidth="100%" minHeight="100vh">
            <Head>
                <title>Terms of service - Exxpenses</title>
                <meta
                    name="description"
                    content="Exxpenses terms of service."
                    key="desc"
                />
            </Head>

            <Box>
                <Topbar user={ssr.userGet.user ? ssr.userGet.user as User : undefined} />
                <Box paddingY="40px" padding="10px" marginX="auto" maxWidth="990px" justifyContent="center" display="flex">
                    <CardBox marginTop="40px">
                        <TOSContent />
                    </CardBox>
                </Box>
                <Footer />
            </Box>
        </Box>
    )
}

export async function getServerSideProps({ req }: any) {
    const userData = await userGet(req);
    return {
        props: {
            ssr: {
                userGet: userData,
            }
        }
    }
}
