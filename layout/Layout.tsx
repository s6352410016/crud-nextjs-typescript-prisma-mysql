import Head from "next/head";
import React, { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
    pageTitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, pageTitle }) => {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="crud-nextjs-typescript-prisma-mysql" />
                <title>{pageTitle || "ShowProducts"}</title>
            </Head>
            {children}
        </>
    );
}

export default Layout;