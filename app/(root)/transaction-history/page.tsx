import HeaderBox from "@/components/ui/HeaderBox";
import { getAccounts, getAccount } from "@/lib/actions/banks.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import React from "react";
import { formatCurrency } from "@/lib/utils";
import TransactionTable from "@/components/ui/TransactionTable";
import { Pagination } from "@/components/ui/Pagination";

const TransactionHistory = async ({
  searchParams: { id, page },
}: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;

  //fetch user info from session
  const loggedInUser = await getLoggedInUser();

  //check if signed in

  if (!loggedInUser) {
    return;
  }

  //fetch account data for a user from plaid
  //here we will call a method providing the id of the bank to
  //retrieve the bank access token and call plaid api for the accoutn financial info
  const accounts = await getAccounts({ userId: loggedInUser.$id });

  if (!accounts) {
    return;
  }

  //fetch specific account info based on the id
  const accountsData = accounts?.data;

  //typescript assertion to treat id as string

  const appwriteItemId = (id as string) || accountsData[0].appwriteItemId;

  //fetch account data using ID
  const account = await getAccount({ appwriteItemId });

  const definedRowCount = 10;
  const transactionsCount = account?.transactions.length;
  const totalPages = Math.ceil(transactionsCount / definedRowCount);

  //calculate index of the transactions on the current page
  const indexLastTransaction = definedRowCount * currentPage;
  const indexFirstTransaction = indexLastTransaction - definedRowCount;

  //obtain current transactions to render on page
  const currentTransactions = account?.transactions.slice(
    indexFirstTransaction,
    indexLastTransaction
  );

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title={"Transaction History"}
          subtext={"Please view your transaction details here"}
        />
      </div>
      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            <h2 className="text-18 font-bold text-white">
              {account?.data.name}
            </h2>
            <p className="text-14 font-semibold text-blue-25">
              {account?.data.officialName}
            </p>
            <p className="text-14 font-ibm-plex-serif text-white">
              ●●●● ●●●● ●●●● {account?.data.mask}
            </p>
          </div>

          <div className="transactions-account-balance">
            <p className="text-14 font-semibold">Current Balance</p>
            <p className="text-24 text-center font-bold">
              {formatCurrency(account?.data.currentBalance)}
            </p>
          </div>
          <></>
        </div>
      </div>
      <section>
        <TransactionTable transactions={currentTransactions} />
      </section>

      {totalPages > 1 && (
        <div className="my-4 w-full">
          <Pagination page={currentPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
