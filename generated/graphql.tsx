import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

/** The category model */
export type Category = {
  __typename?: 'Category';
  /** The category's default curreny */
  default_currency: Scalars['String'];
  id: Scalars['ID'];
  /** Last update for this category */
  last_update: Scalars['DateTime'];
  /** The category's name */
  name: Scalars['String'];
};

export type CategoryAddInput = {
  default_currency: Scalars['String'];
  name: Scalars['String'];
};

export type CategoryEditInput = {
  default_currency: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
};

export type CategoryResposne = {
  __typename?: 'CategoryResposne';
  categories?: Maybe<Array<Category>>;
  error?: Maybe<GenericFieldError>;
};

/** The expense model */
export type Expense = {
  __typename?: 'Expense';
  /** This expenses' prefered currency */
  currency: Scalars['String'];
  /** When this expense was made */
  date: Scalars['DateTime'];
  /** This expenses' description */
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** This expenses' price */
  price: Scalars['Float'];
};

export type ExpenseAddInput = {
  category_name: Scalars['String'];
  currency: Scalars['String'];
  date: Scalars['DateTime'];
  description?: InputMaybe<Scalars['String']>;
  price: Scalars['Float'];
};

export type ExpenseDeleteInput = {
  category_name: Scalars['String'];
  expense_id: Scalars['String'];
};

export type ExpenseEditInput = {
  category_name: Scalars['String'];
  currency: Scalars['String'];
  date: Scalars['DateTime'];
  expense_id: Scalars['String'];
  price: Scalars['Float'];
};

export type ExpenseResponse = {
  __typename?: 'ExpenseResponse';
  error?: Maybe<GenericFieldError>;
  expenses?: Maybe<Array<Expense>>;
};

export type ExpenseTotalCost = {
  __typename?: 'ExpenseTotalCost';
  currency: Scalars['String'];
  price: Scalars['Float'];
};

export type ExpenseTotalCostMultiple = {
  __typename?: 'ExpenseTotalCostMultiple';
  category_name: Scalars['String'];
  total: Array<ExpenseTotalCost>;
};

export type ExpensesCostResponse = {
  __typename?: 'ExpensesCostResponse';
  costs?: Maybe<Array<ExpenseTotalCost>>;
  error?: Maybe<GenericFieldError>;
};

export type ExpensesCostResponseMultiple = {
  __typename?: 'ExpensesCostResponseMultiple';
  costs?: Maybe<Array<ExpenseTotalCostMultiple>>;
  error?: Maybe<GenericFieldError>;
};

export type ExpensesGetInput = {
  category_name: Scalars['String'];
  since?: InputMaybe<Scalars['DateTime']>;
  until?: InputMaybe<Scalars['DateTime']>;
};

export type ExpensesGetInputMultiple = {
  category_names: Array<Scalars['String']>;
  since?: InputMaybe<Scalars['DateTime']>;
  until?: InputMaybe<Scalars['DateTime']>;
};

export type GenericFieldError = {
  __typename?: 'GenericFieldError';
  field?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  categoryAdd: CategoryResposne;
  categoryDelete: Scalars['Boolean'];
  categoryEdit: Scalars['Boolean'];
  expenseAdd: ExpenseResponse;
  expenseDelete: Scalars['Boolean'];
  expenseEdit: ExpenseResponse;
  userChangePassword: Scalars['Boolean'];
  userDeleteAccount: Scalars['Boolean'];
  /** Create a session for a user. */
  userLogin: UserResponse;
  userLogout: Scalars['Boolean'];
  userRecoverPassword: Scalars['Boolean'];
  /** Register a new user. */
  userRegister: UserResponse;
  userSendVerificationEmail: Scalars['Boolean'];
  userSetPassword: Scalars['Boolean'];
  userUnsubscribe: Scalars['Boolean'];
  userUpdatePreferredCurrency: Scalars['Boolean'];
  userVerifyEmail: Scalars['Boolean'];
};


export type MutationCategoryAddArgs = {
  categoryAddData: CategoryAddInput;
};


export type MutationCategoryDeleteArgs = {
  category_name: Scalars['String'];
};


export type MutationCategoryEditArgs = {
  categoryEditData: CategoryEditInput;
};


export type MutationExpenseAddArgs = {
  expenseAddData: ExpenseAddInput;
};


export type MutationExpenseDeleteArgs = {
  expenseDeleteData: ExpenseDeleteInput;
};


export type MutationExpenseEditArgs = {
  expenseEditData: ExpenseEditInput;
};


export type MutationUserChangePasswordArgs = {
  old_password: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUserDeleteAccountArgs = {
  password: Scalars['String'];
};


export type MutationUserLoginArgs = {
  loginUserData: UserLoginInput;
};


export type MutationUserRecoverPasswordArgs = {
  email: Scalars['String'];
  token: Scalars['String'];
};


export type MutationUserRegisterArgs = {
  registerUserData: UserRegisterInput;
};


export type MutationUserSetPasswordArgs = {
  password: Scalars['String'];
  token: Scalars['String'];
};


export type MutationUserUpdatePreferredCurrencyArgs = {
  preferred_currency: Scalars['String'];
};


export type MutationUserVerifyEmailArgs = {
  token: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  categoriesGet: CategoryResposne;
  categoryGet: CategoryResposne;
  expensesGet: ExpenseResponse;
  expensesTotalCostGet: ExpensesCostResponse;
  expensesTotalCostGetMultiple: ExpensesCostResponseMultiple;
  /** Get the currently logged in user. */
  userGet: UserResponse;
  userGetPremiumSubscriptionPricing?: Maybe<UserSubscriptionPricing>;
  userGetSubscriptionInfo?: Maybe<UserSubscriptionInfo>;
  userIsPasswordResetTokenValid: Scalars['Boolean'];
};


export type QueryCategoryGetArgs = {
  categoryName: Scalars['String'];
};


export type QueryExpensesGetArgs = {
  expenseGetData: ExpensesGetInput;
};


export type QueryExpensesTotalCostGetArgs = {
  expenseGetData: ExpensesGetInput;
};


export type QueryExpensesTotalCostGetMultipleArgs = {
  expenseGetData: ExpensesGetInputMultiple;
};


export type QueryUserIsPasswordResetTokenValidArgs = {
  token: Scalars['String'];
};

/** The user model */
export type User = {
  __typename?: 'User';
  categories: Array<Category>;
  /** The user's email */
  email: Scalars['String'];
  /** The user's firstname */
  firstname: Scalars['String'];
  id: Scalars['ID'];
  /** The user's lastname */
  lastname: Scalars['String'];
  /** The user's phone number */
  phone_number: Scalars['String'];
  /** The user's plan */
  plan: Scalars['Float'];
  /** The user's preferred currency */
  preferred_currency?: Maybe<Scalars['String']>;
  signup_date: Scalars['DateTime'];
  /** True if the user has verified their email address */
  verified_email: Scalars['Boolean'];
};

export type UserLoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};

export type UserRegisterInput = {
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  password: Scalars['String'];
  token: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  error?: Maybe<GenericFieldError>;
  user?: Maybe<User>;
};

export type UserSubscriptionInfo = {
  __typename?: 'UserSubscriptionInfo';
  cancel_at_end: Scalars['Boolean'];
  price: Scalars['Float'];
  since: Scalars['DateTime'];
  until: Scalars['DateTime'];
};

export type UserSubscriptionPricing = {
  __typename?: 'UserSubscriptionPricing';
  discount_perc: Scalars['Float'];
  price: Scalars['Float'];
};

export type CategoryAddMutationVariables = Exact<{
  addData: CategoryAddInput;
}>;


export type CategoryAddMutation = { __typename?: 'Mutation', categoryAdd: { __typename?: 'CategoryResposne', categories?: Array<{ __typename?: 'Category', name: string }> | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type CategoryDeleteMutationVariables = Exact<{
  category_name: Scalars['String'];
}>;


export type CategoryDeleteMutation = { __typename?: 'Mutation', categoryDelete: boolean };

export type CategoryEditMutationVariables = Exact<{
  editData: CategoryEditInput;
}>;


export type CategoryEditMutation = { __typename?: 'Mutation', categoryEdit: boolean };

export type ExpenseAddMutationVariables = Exact<{
  addData: ExpenseAddInput;
}>;


export type ExpenseAddMutation = { __typename?: 'Mutation', expenseAdd: { __typename?: 'ExpenseResponse', expenses?: Array<{ __typename?: 'Expense', price: number, currency: string }> | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type ExpenseDeleteMutationVariables = Exact<{
  deleteData: ExpenseDeleteInput;
}>;


export type ExpenseDeleteMutation = { __typename?: 'Mutation', expenseDelete: boolean };

export type ExpenseEditMutationVariables = Exact<{
  editData: ExpenseEditInput;
}>;


export type ExpenseEditMutation = { __typename?: 'Mutation', expenseEdit: { __typename?: 'ExpenseResponse', expenses?: Array<{ __typename?: 'Expense', price: number, currency: string, date: any }> | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type UserChangePasswordMutationVariables = Exact<{
  old_password: Scalars['String'];
  password: Scalars['String'];
}>;


export type UserChangePasswordMutation = { __typename?: 'Mutation', userChangePassword: boolean };

export type UserDeleteAccountMutationVariables = Exact<{
  password: Scalars['String'];
}>;


export type UserDeleteAccountMutation = { __typename?: 'Mutation', userDeleteAccount: boolean };

export type UserLoginMutationVariables = Exact<{
  loginData: UserLoginInput;
}>;


export type UserLoginMutation = { __typename?: 'Mutation', userLogin: { __typename?: 'UserResponse', user?: { __typename?: 'User', lastname: string } | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type UserLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type UserLogoutMutation = { __typename?: 'Mutation', userLogout: boolean };

export type UserRecoverPasswordMutationVariables = Exact<{
  email: Scalars['String'];
  token: Scalars['String'];
}>;


export type UserRecoverPasswordMutation = { __typename?: 'Mutation', userRecoverPassword: boolean };

export type UserRegisterMutationVariables = Exact<{
  registerData: UserRegisterInput;
}>;


export type UserRegisterMutation = { __typename?: 'Mutation', userRegister: { __typename?: 'UserResponse', user?: { __typename?: 'User', lastname: string } | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type UserSendVerificationEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type UserSendVerificationEmailMutation = { __typename?: 'Mutation', userSendVerificationEmail: boolean };

export type UserSetPasswordMutationVariables = Exact<{
  token: Scalars['String'];
  password: Scalars['String'];
}>;


export type UserSetPasswordMutation = { __typename?: 'Mutation', userSetPassword: boolean };

export type UserUnsubscribeMutationVariables = Exact<{ [key: string]: never; }>;


export type UserUnsubscribeMutation = { __typename?: 'Mutation', userUnsubscribe: boolean };

export type UserUpdatePreferredCurrencyMutationVariables = Exact<{
  preferred_currency: Scalars['String'];
}>;


export type UserUpdatePreferredCurrencyMutation = { __typename?: 'Mutation', userUpdatePreferredCurrency: boolean };

export type UserVerifyEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type UserVerifyEmailMutation = { __typename?: 'Mutation', userVerifyEmail: boolean };

export type CategoriesGetQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesGetQuery = { __typename?: 'Query', categoriesGet: { __typename?: 'CategoryResposne', categories?: Array<{ __typename?: 'Category', name: string, default_currency: string }> | null, error?: { __typename?: 'GenericFieldError', name: string } | null } };

export type CategoryGetQueryVariables = Exact<{
  categoryName: Scalars['String'];
}>;


export type CategoryGetQuery = { __typename?: 'Query', categoryGet: { __typename?: 'CategoryResposne', categories?: Array<{ __typename?: 'Category', id: string, name: string, default_currency: string, last_update: any }> | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type ExpensesGetQueryVariables = Exact<{
  getData: ExpensesGetInput;
}>;


export type ExpensesGetQuery = { __typename?: 'Query', expensesGet: { __typename?: 'ExpenseResponse', expenses?: Array<{ __typename?: 'Expense', id: string, date: any, price: number, currency: string, description?: string | null }> | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type ExpensesTotalCostGetQueryVariables = Exact<{
  getData: ExpensesGetInput;
}>;


export type ExpensesTotalCostGetQuery = { __typename?: 'Query', expensesTotalCostGet: { __typename?: 'ExpensesCostResponse', costs?: Array<{ __typename?: 'ExpenseTotalCost', price: number, currency: string }> | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type ExpensesTotalCostGetMultipleQueryVariables = Exact<{
  getData: ExpensesGetInputMultiple;
}>;


export type ExpensesTotalCostGetMultipleQuery = { __typename?: 'Query', expensesTotalCostGetMultiple: { __typename?: 'ExpensesCostResponseMultiple', costs?: Array<{ __typename?: 'ExpenseTotalCostMultiple', category_name: string, total: Array<{ __typename?: 'ExpenseTotalCost', price: number, currency: string }> }> | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type UserGetQueryVariables = Exact<{ [key: string]: never; }>;


export type UserGetQuery = { __typename?: 'Query', userGet: { __typename?: 'UserResponse', user?: { __typename?: 'User', lastname: string, firstname: string, email: string, preferred_currency?: string | null, verified_email: boolean, plan: number } | null, error?: { __typename?: 'GenericFieldError', name: string } | null } };

export type UserGetPremiumSubscriptionPricingQueryVariables = Exact<{ [key: string]: never; }>;


export type UserGetPremiumSubscriptionPricingQuery = { __typename?: 'Query', userGetPremiumSubscriptionPricing?: { __typename?: 'UserSubscriptionPricing', price: number, discount_perc: number } | null };

export type UserGetSubscriptionInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type UserGetSubscriptionInfoQuery = { __typename?: 'Query', userGetSubscriptionInfo?: { __typename?: 'UserSubscriptionInfo', since: any, until: any, price: number, cancel_at_end: boolean } | null };

export type UserIsPasswordResetTokenValidQueryVariables = Exact<{
  token: Scalars['String'];
}>;


export type UserIsPasswordResetTokenValidQuery = { __typename?: 'Query', userIsPasswordResetTokenValid: boolean };


export const CategoryAddDocument = gql`
    mutation CategoryAdd($addData: CategoryAddInput!) {
  categoryAdd(categoryAddData: $addData) {
    categories {
      name
    }
    error {
      name
      field
    }
  }
}
    `;
export type CategoryAddMutationFn = Apollo.MutationFunction<CategoryAddMutation, CategoryAddMutationVariables>;

/**
 * __useCategoryAddMutation__
 *
 * To run a mutation, you first call `useCategoryAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCategoryAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [categoryAddMutation, { data, loading, error }] = useCategoryAddMutation({
 *   variables: {
 *      addData: // value for 'addData'
 *   },
 * });
 */
export function useCategoryAddMutation(baseOptions?: Apollo.MutationHookOptions<CategoryAddMutation, CategoryAddMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CategoryAddMutation, CategoryAddMutationVariables>(CategoryAddDocument, options);
      }
export type CategoryAddMutationHookResult = ReturnType<typeof useCategoryAddMutation>;
export type CategoryAddMutationResult = Apollo.MutationResult<CategoryAddMutation>;
export type CategoryAddMutationOptions = Apollo.BaseMutationOptions<CategoryAddMutation, CategoryAddMutationVariables>;
export const CategoryDeleteDocument = gql`
    mutation CategoryDelete($category_name: String!) {
  categoryDelete(category_name: $category_name)
}
    `;
export type CategoryDeleteMutationFn = Apollo.MutationFunction<CategoryDeleteMutation, CategoryDeleteMutationVariables>;

/**
 * __useCategoryDeleteMutation__
 *
 * To run a mutation, you first call `useCategoryDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCategoryDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [categoryDeleteMutation, { data, loading, error }] = useCategoryDeleteMutation({
 *   variables: {
 *      category_name: // value for 'category_name'
 *   },
 * });
 */
export function useCategoryDeleteMutation(baseOptions?: Apollo.MutationHookOptions<CategoryDeleteMutation, CategoryDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CategoryDeleteMutation, CategoryDeleteMutationVariables>(CategoryDeleteDocument, options);
      }
export type CategoryDeleteMutationHookResult = ReturnType<typeof useCategoryDeleteMutation>;
export type CategoryDeleteMutationResult = Apollo.MutationResult<CategoryDeleteMutation>;
export type CategoryDeleteMutationOptions = Apollo.BaseMutationOptions<CategoryDeleteMutation, CategoryDeleteMutationVariables>;
export const CategoryEditDocument = gql`
    mutation CategoryEdit($editData: CategoryEditInput!) {
  categoryEdit(categoryEditData: $editData)
}
    `;
export type CategoryEditMutationFn = Apollo.MutationFunction<CategoryEditMutation, CategoryEditMutationVariables>;

/**
 * __useCategoryEditMutation__
 *
 * To run a mutation, you first call `useCategoryEditMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCategoryEditMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [categoryEditMutation, { data, loading, error }] = useCategoryEditMutation({
 *   variables: {
 *      editData: // value for 'editData'
 *   },
 * });
 */
export function useCategoryEditMutation(baseOptions?: Apollo.MutationHookOptions<CategoryEditMutation, CategoryEditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CategoryEditMutation, CategoryEditMutationVariables>(CategoryEditDocument, options);
      }
export type CategoryEditMutationHookResult = ReturnType<typeof useCategoryEditMutation>;
export type CategoryEditMutationResult = Apollo.MutationResult<CategoryEditMutation>;
export type CategoryEditMutationOptions = Apollo.BaseMutationOptions<CategoryEditMutation, CategoryEditMutationVariables>;
export const ExpenseAddDocument = gql`
    mutation ExpenseAdd($addData: ExpenseAddInput!) {
  expenseAdd(expenseAddData: $addData) {
    expenses {
      price
      currency
    }
    error {
      name
      field
    }
  }
}
    `;
export type ExpenseAddMutationFn = Apollo.MutationFunction<ExpenseAddMutation, ExpenseAddMutationVariables>;

/**
 * __useExpenseAddMutation__
 *
 * To run a mutation, you first call `useExpenseAddMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExpenseAddMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [expenseAddMutation, { data, loading, error }] = useExpenseAddMutation({
 *   variables: {
 *      addData: // value for 'addData'
 *   },
 * });
 */
export function useExpenseAddMutation(baseOptions?: Apollo.MutationHookOptions<ExpenseAddMutation, ExpenseAddMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ExpenseAddMutation, ExpenseAddMutationVariables>(ExpenseAddDocument, options);
      }
export type ExpenseAddMutationHookResult = ReturnType<typeof useExpenseAddMutation>;
export type ExpenseAddMutationResult = Apollo.MutationResult<ExpenseAddMutation>;
export type ExpenseAddMutationOptions = Apollo.BaseMutationOptions<ExpenseAddMutation, ExpenseAddMutationVariables>;
export const ExpenseDeleteDocument = gql`
    mutation ExpenseDelete($deleteData: ExpenseDeleteInput!) {
  expenseDelete(expenseDeleteData: $deleteData)
}
    `;
export type ExpenseDeleteMutationFn = Apollo.MutationFunction<ExpenseDeleteMutation, ExpenseDeleteMutationVariables>;

/**
 * __useExpenseDeleteMutation__
 *
 * To run a mutation, you first call `useExpenseDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExpenseDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [expenseDeleteMutation, { data, loading, error }] = useExpenseDeleteMutation({
 *   variables: {
 *      deleteData: // value for 'deleteData'
 *   },
 * });
 */
export function useExpenseDeleteMutation(baseOptions?: Apollo.MutationHookOptions<ExpenseDeleteMutation, ExpenseDeleteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ExpenseDeleteMutation, ExpenseDeleteMutationVariables>(ExpenseDeleteDocument, options);
      }
export type ExpenseDeleteMutationHookResult = ReturnType<typeof useExpenseDeleteMutation>;
export type ExpenseDeleteMutationResult = Apollo.MutationResult<ExpenseDeleteMutation>;
export type ExpenseDeleteMutationOptions = Apollo.BaseMutationOptions<ExpenseDeleteMutation, ExpenseDeleteMutationVariables>;
export const ExpenseEditDocument = gql`
    mutation ExpenseEdit($editData: ExpenseEditInput!) {
  expenseEdit(expenseEditData: $editData) {
    expenses {
      price
      currency
      date
    }
    error {
      name
      field
    }
  }
}
    `;
export type ExpenseEditMutationFn = Apollo.MutationFunction<ExpenseEditMutation, ExpenseEditMutationVariables>;

/**
 * __useExpenseEditMutation__
 *
 * To run a mutation, you first call `useExpenseEditMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExpenseEditMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [expenseEditMutation, { data, loading, error }] = useExpenseEditMutation({
 *   variables: {
 *      editData: // value for 'editData'
 *   },
 * });
 */
export function useExpenseEditMutation(baseOptions?: Apollo.MutationHookOptions<ExpenseEditMutation, ExpenseEditMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ExpenseEditMutation, ExpenseEditMutationVariables>(ExpenseEditDocument, options);
      }
export type ExpenseEditMutationHookResult = ReturnType<typeof useExpenseEditMutation>;
export type ExpenseEditMutationResult = Apollo.MutationResult<ExpenseEditMutation>;
export type ExpenseEditMutationOptions = Apollo.BaseMutationOptions<ExpenseEditMutation, ExpenseEditMutationVariables>;
export const UserChangePasswordDocument = gql`
    mutation UserChangePassword($old_password: String!, $password: String!) {
  userChangePassword(old_password: $old_password, password: $password)
}
    `;
export type UserChangePasswordMutationFn = Apollo.MutationFunction<UserChangePasswordMutation, UserChangePasswordMutationVariables>;

/**
 * __useUserChangePasswordMutation__
 *
 * To run a mutation, you first call `useUserChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userChangePasswordMutation, { data, loading, error }] = useUserChangePasswordMutation({
 *   variables: {
 *      old_password: // value for 'old_password'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useUserChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<UserChangePasswordMutation, UserChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserChangePasswordMutation, UserChangePasswordMutationVariables>(UserChangePasswordDocument, options);
      }
export type UserChangePasswordMutationHookResult = ReturnType<typeof useUserChangePasswordMutation>;
export type UserChangePasswordMutationResult = Apollo.MutationResult<UserChangePasswordMutation>;
export type UserChangePasswordMutationOptions = Apollo.BaseMutationOptions<UserChangePasswordMutation, UserChangePasswordMutationVariables>;
export const UserDeleteAccountDocument = gql`
    mutation UserDeleteAccount($password: String!) {
  userDeleteAccount(password: $password)
}
    `;
export type UserDeleteAccountMutationFn = Apollo.MutationFunction<UserDeleteAccountMutation, UserDeleteAccountMutationVariables>;

/**
 * __useUserDeleteAccountMutation__
 *
 * To run a mutation, you first call `useUserDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userDeleteAccountMutation, { data, loading, error }] = useUserDeleteAccountMutation({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useUserDeleteAccountMutation(baseOptions?: Apollo.MutationHookOptions<UserDeleteAccountMutation, UserDeleteAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserDeleteAccountMutation, UserDeleteAccountMutationVariables>(UserDeleteAccountDocument, options);
      }
export type UserDeleteAccountMutationHookResult = ReturnType<typeof useUserDeleteAccountMutation>;
export type UserDeleteAccountMutationResult = Apollo.MutationResult<UserDeleteAccountMutation>;
export type UserDeleteAccountMutationOptions = Apollo.BaseMutationOptions<UserDeleteAccountMutation, UserDeleteAccountMutationVariables>;
export const UserLoginDocument = gql`
    mutation UserLogin($loginData: UserLoginInput!) {
  userLogin(loginUserData: $loginData) {
    user {
      lastname
    }
    error {
      name
      field
    }
  }
}
    `;
export type UserLoginMutationFn = Apollo.MutationFunction<UserLoginMutation, UserLoginMutationVariables>;

/**
 * __useUserLoginMutation__
 *
 * To run a mutation, you first call `useUserLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userLoginMutation, { data, loading, error }] = useUserLoginMutation({
 *   variables: {
 *      loginData: // value for 'loginData'
 *   },
 * });
 */
export function useUserLoginMutation(baseOptions?: Apollo.MutationHookOptions<UserLoginMutation, UserLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserLoginMutation, UserLoginMutationVariables>(UserLoginDocument, options);
      }
export type UserLoginMutationHookResult = ReturnType<typeof useUserLoginMutation>;
export type UserLoginMutationResult = Apollo.MutationResult<UserLoginMutation>;
export type UserLoginMutationOptions = Apollo.BaseMutationOptions<UserLoginMutation, UserLoginMutationVariables>;
export const UserLogoutDocument = gql`
    mutation UserLogout {
  userLogout
}
    `;
export type UserLogoutMutationFn = Apollo.MutationFunction<UserLogoutMutation, UserLogoutMutationVariables>;

/**
 * __useUserLogoutMutation__
 *
 * To run a mutation, you first call `useUserLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userLogoutMutation, { data, loading, error }] = useUserLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useUserLogoutMutation(baseOptions?: Apollo.MutationHookOptions<UserLogoutMutation, UserLogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserLogoutMutation, UserLogoutMutationVariables>(UserLogoutDocument, options);
      }
export type UserLogoutMutationHookResult = ReturnType<typeof useUserLogoutMutation>;
export type UserLogoutMutationResult = Apollo.MutationResult<UserLogoutMutation>;
export type UserLogoutMutationOptions = Apollo.BaseMutationOptions<UserLogoutMutation, UserLogoutMutationVariables>;
export const UserRecoverPasswordDocument = gql`
    mutation UserRecoverPassword($email: String!, $token: String!) {
  userRecoverPassword(email: $email, token: $token)
}
    `;
export type UserRecoverPasswordMutationFn = Apollo.MutationFunction<UserRecoverPasswordMutation, UserRecoverPasswordMutationVariables>;

/**
 * __useUserRecoverPasswordMutation__
 *
 * To run a mutation, you first call `useUserRecoverPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserRecoverPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userRecoverPasswordMutation, { data, loading, error }] = useUserRecoverPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useUserRecoverPasswordMutation(baseOptions?: Apollo.MutationHookOptions<UserRecoverPasswordMutation, UserRecoverPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserRecoverPasswordMutation, UserRecoverPasswordMutationVariables>(UserRecoverPasswordDocument, options);
      }
export type UserRecoverPasswordMutationHookResult = ReturnType<typeof useUserRecoverPasswordMutation>;
export type UserRecoverPasswordMutationResult = Apollo.MutationResult<UserRecoverPasswordMutation>;
export type UserRecoverPasswordMutationOptions = Apollo.BaseMutationOptions<UserRecoverPasswordMutation, UserRecoverPasswordMutationVariables>;
export const UserRegisterDocument = gql`
    mutation UserRegister($registerData: UserRegisterInput!) {
  userRegister(registerUserData: $registerData) {
    user {
      lastname
    }
    error {
      name
      field
    }
  }
}
    `;
export type UserRegisterMutationFn = Apollo.MutationFunction<UserRegisterMutation, UserRegisterMutationVariables>;

/**
 * __useUserRegisterMutation__
 *
 * To run a mutation, you first call `useUserRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userRegisterMutation, { data, loading, error }] = useUserRegisterMutation({
 *   variables: {
 *      registerData: // value for 'registerData'
 *   },
 * });
 */
export function useUserRegisterMutation(baseOptions?: Apollo.MutationHookOptions<UserRegisterMutation, UserRegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserRegisterMutation, UserRegisterMutationVariables>(UserRegisterDocument, options);
      }
export type UserRegisterMutationHookResult = ReturnType<typeof useUserRegisterMutation>;
export type UserRegisterMutationResult = Apollo.MutationResult<UserRegisterMutation>;
export type UserRegisterMutationOptions = Apollo.BaseMutationOptions<UserRegisterMutation, UserRegisterMutationVariables>;
export const UserSendVerificationEmailDocument = gql`
    mutation UserSendVerificationEmail {
  userSendVerificationEmail
}
    `;
export type UserSendVerificationEmailMutationFn = Apollo.MutationFunction<UserSendVerificationEmailMutation, UserSendVerificationEmailMutationVariables>;

/**
 * __useUserSendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useUserSendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserSendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userSendVerificationEmailMutation, { data, loading, error }] = useUserSendVerificationEmailMutation({
 *   variables: {
 *   },
 * });
 */
export function useUserSendVerificationEmailMutation(baseOptions?: Apollo.MutationHookOptions<UserSendVerificationEmailMutation, UserSendVerificationEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserSendVerificationEmailMutation, UserSendVerificationEmailMutationVariables>(UserSendVerificationEmailDocument, options);
      }
export type UserSendVerificationEmailMutationHookResult = ReturnType<typeof useUserSendVerificationEmailMutation>;
export type UserSendVerificationEmailMutationResult = Apollo.MutationResult<UserSendVerificationEmailMutation>;
export type UserSendVerificationEmailMutationOptions = Apollo.BaseMutationOptions<UserSendVerificationEmailMutation, UserSendVerificationEmailMutationVariables>;
export const UserSetPasswordDocument = gql`
    mutation UserSetPassword($token: String!, $password: String!) {
  userSetPassword(token: $token, password: $password)
}
    `;
export type UserSetPasswordMutationFn = Apollo.MutationFunction<UserSetPasswordMutation, UserSetPasswordMutationVariables>;

/**
 * __useUserSetPasswordMutation__
 *
 * To run a mutation, you first call `useUserSetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserSetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userSetPasswordMutation, { data, loading, error }] = useUserSetPasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useUserSetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<UserSetPasswordMutation, UserSetPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserSetPasswordMutation, UserSetPasswordMutationVariables>(UserSetPasswordDocument, options);
      }
export type UserSetPasswordMutationHookResult = ReturnType<typeof useUserSetPasswordMutation>;
export type UserSetPasswordMutationResult = Apollo.MutationResult<UserSetPasswordMutation>;
export type UserSetPasswordMutationOptions = Apollo.BaseMutationOptions<UserSetPasswordMutation, UserSetPasswordMutationVariables>;
export const UserUnsubscribeDocument = gql`
    mutation UserUnsubscribe {
  userUnsubscribe
}
    `;
export type UserUnsubscribeMutationFn = Apollo.MutationFunction<UserUnsubscribeMutation, UserUnsubscribeMutationVariables>;

/**
 * __useUserUnsubscribeMutation__
 *
 * To run a mutation, you first call `useUserUnsubscribeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserUnsubscribeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userUnsubscribeMutation, { data, loading, error }] = useUserUnsubscribeMutation({
 *   variables: {
 *   },
 * });
 */
export function useUserUnsubscribeMutation(baseOptions?: Apollo.MutationHookOptions<UserUnsubscribeMutation, UserUnsubscribeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserUnsubscribeMutation, UserUnsubscribeMutationVariables>(UserUnsubscribeDocument, options);
      }
export type UserUnsubscribeMutationHookResult = ReturnType<typeof useUserUnsubscribeMutation>;
export type UserUnsubscribeMutationResult = Apollo.MutationResult<UserUnsubscribeMutation>;
export type UserUnsubscribeMutationOptions = Apollo.BaseMutationOptions<UserUnsubscribeMutation, UserUnsubscribeMutationVariables>;
export const UserUpdatePreferredCurrencyDocument = gql`
    mutation UserUpdatePreferredCurrency($preferred_currency: String!) {
  userUpdatePreferredCurrency(preferred_currency: $preferred_currency)
}
    `;
export type UserUpdatePreferredCurrencyMutationFn = Apollo.MutationFunction<UserUpdatePreferredCurrencyMutation, UserUpdatePreferredCurrencyMutationVariables>;

/**
 * __useUserUpdatePreferredCurrencyMutation__
 *
 * To run a mutation, you first call `useUserUpdatePreferredCurrencyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserUpdatePreferredCurrencyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userUpdatePreferredCurrencyMutation, { data, loading, error }] = useUserUpdatePreferredCurrencyMutation({
 *   variables: {
 *      preferred_currency: // value for 'preferred_currency'
 *   },
 * });
 */
export function useUserUpdatePreferredCurrencyMutation(baseOptions?: Apollo.MutationHookOptions<UserUpdatePreferredCurrencyMutation, UserUpdatePreferredCurrencyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserUpdatePreferredCurrencyMutation, UserUpdatePreferredCurrencyMutationVariables>(UserUpdatePreferredCurrencyDocument, options);
      }
export type UserUpdatePreferredCurrencyMutationHookResult = ReturnType<typeof useUserUpdatePreferredCurrencyMutation>;
export type UserUpdatePreferredCurrencyMutationResult = Apollo.MutationResult<UserUpdatePreferredCurrencyMutation>;
export type UserUpdatePreferredCurrencyMutationOptions = Apollo.BaseMutationOptions<UserUpdatePreferredCurrencyMutation, UserUpdatePreferredCurrencyMutationVariables>;
export const UserVerifyEmailDocument = gql`
    mutation UserVerifyEmail($token: String!) {
  userVerifyEmail(token: $token)
}
    `;
export type UserVerifyEmailMutationFn = Apollo.MutationFunction<UserVerifyEmailMutation, UserVerifyEmailMutationVariables>;

/**
 * __useUserVerifyEmailMutation__
 *
 * To run a mutation, you first call `useUserVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userVerifyEmailMutation, { data, loading, error }] = useUserVerifyEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useUserVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<UserVerifyEmailMutation, UserVerifyEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UserVerifyEmailMutation, UserVerifyEmailMutationVariables>(UserVerifyEmailDocument, options);
      }
export type UserVerifyEmailMutationHookResult = ReturnType<typeof useUserVerifyEmailMutation>;
export type UserVerifyEmailMutationResult = Apollo.MutationResult<UserVerifyEmailMutation>;
export type UserVerifyEmailMutationOptions = Apollo.BaseMutationOptions<UserVerifyEmailMutation, UserVerifyEmailMutationVariables>;
export const CategoriesGetDocument = gql`
    query CategoriesGet {
  categoriesGet {
    categories {
      name
      default_currency
    }
    error {
      name
    }
  }
}
    `;

/**
 * __useCategoriesGetQuery__
 *
 * To run a query within a React component, call `useCategoriesGetQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesGetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesGetQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoriesGetQuery(baseOptions?: Apollo.QueryHookOptions<CategoriesGetQuery, CategoriesGetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoriesGetQuery, CategoriesGetQueryVariables>(CategoriesGetDocument, options);
      }
export function useCategoriesGetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesGetQuery, CategoriesGetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoriesGetQuery, CategoriesGetQueryVariables>(CategoriesGetDocument, options);
        }
export type CategoriesGetQueryHookResult = ReturnType<typeof useCategoriesGetQuery>;
export type CategoriesGetLazyQueryHookResult = ReturnType<typeof useCategoriesGetLazyQuery>;
export type CategoriesGetQueryResult = Apollo.QueryResult<CategoriesGetQuery, CategoriesGetQueryVariables>;
export const CategoryGetDocument = gql`
    query CategoryGet($categoryName: String!) {
  categoryGet(categoryName: $categoryName) {
    categories {
      id
      name
      default_currency
      last_update
    }
    error {
      name
      field
    }
  }
}
    `;

/**
 * __useCategoryGetQuery__
 *
 * To run a query within a React component, call `useCategoryGetQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoryGetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoryGetQuery({
 *   variables: {
 *      categoryName: // value for 'categoryName'
 *   },
 * });
 */
export function useCategoryGetQuery(baseOptions: Apollo.QueryHookOptions<CategoryGetQuery, CategoryGetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoryGetQuery, CategoryGetQueryVariables>(CategoryGetDocument, options);
      }
export function useCategoryGetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoryGetQuery, CategoryGetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoryGetQuery, CategoryGetQueryVariables>(CategoryGetDocument, options);
        }
export type CategoryGetQueryHookResult = ReturnType<typeof useCategoryGetQuery>;
export type CategoryGetLazyQueryHookResult = ReturnType<typeof useCategoryGetLazyQuery>;
export type CategoryGetQueryResult = Apollo.QueryResult<CategoryGetQuery, CategoryGetQueryVariables>;
export const ExpensesGetDocument = gql`
    query ExpensesGet($getData: ExpensesGetInput!) {
  expensesGet(expenseGetData: $getData) {
    expenses {
      id
      date
      price
      currency
      description
    }
    error {
      name
      field
    }
  }
}
    `;

/**
 * __useExpensesGetQuery__
 *
 * To run a query within a React component, call `useExpensesGetQuery` and pass it any options that fit your needs.
 * When your component renders, `useExpensesGetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExpensesGetQuery({
 *   variables: {
 *      getData: // value for 'getData'
 *   },
 * });
 */
export function useExpensesGetQuery(baseOptions: Apollo.QueryHookOptions<ExpensesGetQuery, ExpensesGetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExpensesGetQuery, ExpensesGetQueryVariables>(ExpensesGetDocument, options);
      }
export function useExpensesGetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExpensesGetQuery, ExpensesGetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExpensesGetQuery, ExpensesGetQueryVariables>(ExpensesGetDocument, options);
        }
export type ExpensesGetQueryHookResult = ReturnType<typeof useExpensesGetQuery>;
export type ExpensesGetLazyQueryHookResult = ReturnType<typeof useExpensesGetLazyQuery>;
export type ExpensesGetQueryResult = Apollo.QueryResult<ExpensesGetQuery, ExpensesGetQueryVariables>;
export const ExpensesTotalCostGetDocument = gql`
    query ExpensesTotalCostGet($getData: ExpensesGetInput!) {
  expensesTotalCostGet(expenseGetData: $getData) {
    costs {
      price
      currency
    }
    error {
      name
      field
    }
  }
}
    `;

/**
 * __useExpensesTotalCostGetQuery__
 *
 * To run a query within a React component, call `useExpensesTotalCostGetQuery` and pass it any options that fit your needs.
 * When your component renders, `useExpensesTotalCostGetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExpensesTotalCostGetQuery({
 *   variables: {
 *      getData: // value for 'getData'
 *   },
 * });
 */
export function useExpensesTotalCostGetQuery(baseOptions: Apollo.QueryHookOptions<ExpensesTotalCostGetQuery, ExpensesTotalCostGetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExpensesTotalCostGetQuery, ExpensesTotalCostGetQueryVariables>(ExpensesTotalCostGetDocument, options);
      }
export function useExpensesTotalCostGetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExpensesTotalCostGetQuery, ExpensesTotalCostGetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExpensesTotalCostGetQuery, ExpensesTotalCostGetQueryVariables>(ExpensesTotalCostGetDocument, options);
        }
export type ExpensesTotalCostGetQueryHookResult = ReturnType<typeof useExpensesTotalCostGetQuery>;
export type ExpensesTotalCostGetLazyQueryHookResult = ReturnType<typeof useExpensesTotalCostGetLazyQuery>;
export type ExpensesTotalCostGetQueryResult = Apollo.QueryResult<ExpensesTotalCostGetQuery, ExpensesTotalCostGetQueryVariables>;
export const ExpensesTotalCostGetMultipleDocument = gql`
    query ExpensesTotalCostGetMultiple($getData: ExpensesGetInputMultiple!) {
  expensesTotalCostGetMultiple(expenseGetData: $getData) {
    costs {
      category_name
      total {
        price
        currency
      }
    }
    error {
      name
      field
    }
  }
}
    `;

/**
 * __useExpensesTotalCostGetMultipleQuery__
 *
 * To run a query within a React component, call `useExpensesTotalCostGetMultipleQuery` and pass it any options that fit your needs.
 * When your component renders, `useExpensesTotalCostGetMultipleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useExpensesTotalCostGetMultipleQuery({
 *   variables: {
 *      getData: // value for 'getData'
 *   },
 * });
 */
export function useExpensesTotalCostGetMultipleQuery(baseOptions: Apollo.QueryHookOptions<ExpensesTotalCostGetMultipleQuery, ExpensesTotalCostGetMultipleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ExpensesTotalCostGetMultipleQuery, ExpensesTotalCostGetMultipleQueryVariables>(ExpensesTotalCostGetMultipleDocument, options);
      }
export function useExpensesTotalCostGetMultipleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ExpensesTotalCostGetMultipleQuery, ExpensesTotalCostGetMultipleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ExpensesTotalCostGetMultipleQuery, ExpensesTotalCostGetMultipleQueryVariables>(ExpensesTotalCostGetMultipleDocument, options);
        }
export type ExpensesTotalCostGetMultipleQueryHookResult = ReturnType<typeof useExpensesTotalCostGetMultipleQuery>;
export type ExpensesTotalCostGetMultipleLazyQueryHookResult = ReturnType<typeof useExpensesTotalCostGetMultipleLazyQuery>;
export type ExpensesTotalCostGetMultipleQueryResult = Apollo.QueryResult<ExpensesTotalCostGetMultipleQuery, ExpensesTotalCostGetMultipleQueryVariables>;
export const UserGetDocument = gql`
    query UserGet {
  userGet {
    user {
      lastname
      firstname
      email
      preferred_currency
      verified_email
      plan
    }
    error {
      name
    }
  }
}
    `;

/**
 * __useUserGetQuery__
 *
 * To run a query within a React component, call `useUserGetQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserGetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserGetQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserGetQuery(baseOptions?: Apollo.QueryHookOptions<UserGetQuery, UserGetQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserGetQuery, UserGetQueryVariables>(UserGetDocument, options);
      }
export function useUserGetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserGetQuery, UserGetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserGetQuery, UserGetQueryVariables>(UserGetDocument, options);
        }
export type UserGetQueryHookResult = ReturnType<typeof useUserGetQuery>;
export type UserGetLazyQueryHookResult = ReturnType<typeof useUserGetLazyQuery>;
export type UserGetQueryResult = Apollo.QueryResult<UserGetQuery, UserGetQueryVariables>;
export const UserGetPremiumSubscriptionPricingDocument = gql`
    query UserGetPremiumSubscriptionPricing {
  userGetPremiumSubscriptionPricing {
    price
    discount_perc
  }
}
    `;

/**
 * __useUserGetPremiumSubscriptionPricingQuery__
 *
 * To run a query within a React component, call `useUserGetPremiumSubscriptionPricingQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserGetPremiumSubscriptionPricingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserGetPremiumSubscriptionPricingQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserGetPremiumSubscriptionPricingQuery(baseOptions?: Apollo.QueryHookOptions<UserGetPremiumSubscriptionPricingQuery, UserGetPremiumSubscriptionPricingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserGetPremiumSubscriptionPricingQuery, UserGetPremiumSubscriptionPricingQueryVariables>(UserGetPremiumSubscriptionPricingDocument, options);
      }
export function useUserGetPremiumSubscriptionPricingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserGetPremiumSubscriptionPricingQuery, UserGetPremiumSubscriptionPricingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserGetPremiumSubscriptionPricingQuery, UserGetPremiumSubscriptionPricingQueryVariables>(UserGetPremiumSubscriptionPricingDocument, options);
        }
export type UserGetPremiumSubscriptionPricingQueryHookResult = ReturnType<typeof useUserGetPremiumSubscriptionPricingQuery>;
export type UserGetPremiumSubscriptionPricingLazyQueryHookResult = ReturnType<typeof useUserGetPremiumSubscriptionPricingLazyQuery>;
export type UserGetPremiumSubscriptionPricingQueryResult = Apollo.QueryResult<UserGetPremiumSubscriptionPricingQuery, UserGetPremiumSubscriptionPricingQueryVariables>;
export const UserGetSubscriptionInfoDocument = gql`
    query UserGetSubscriptionInfo {
  userGetSubscriptionInfo {
    since
    until
    price
    cancel_at_end
  }
}
    `;

/**
 * __useUserGetSubscriptionInfoQuery__
 *
 * To run a query within a React component, call `useUserGetSubscriptionInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserGetSubscriptionInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserGetSubscriptionInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserGetSubscriptionInfoQuery(baseOptions?: Apollo.QueryHookOptions<UserGetSubscriptionInfoQuery, UserGetSubscriptionInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserGetSubscriptionInfoQuery, UserGetSubscriptionInfoQueryVariables>(UserGetSubscriptionInfoDocument, options);
      }
export function useUserGetSubscriptionInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserGetSubscriptionInfoQuery, UserGetSubscriptionInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserGetSubscriptionInfoQuery, UserGetSubscriptionInfoQueryVariables>(UserGetSubscriptionInfoDocument, options);
        }
export type UserGetSubscriptionInfoQueryHookResult = ReturnType<typeof useUserGetSubscriptionInfoQuery>;
export type UserGetSubscriptionInfoLazyQueryHookResult = ReturnType<typeof useUserGetSubscriptionInfoLazyQuery>;
export type UserGetSubscriptionInfoQueryResult = Apollo.QueryResult<UserGetSubscriptionInfoQuery, UserGetSubscriptionInfoQueryVariables>;
export const UserIsPasswordResetTokenValidDocument = gql`
    query UserIsPasswordResetTokenValid($token: String!) {
  userIsPasswordResetTokenValid(token: $token)
}
    `;

/**
 * __useUserIsPasswordResetTokenValidQuery__
 *
 * To run a query within a React component, call `useUserIsPasswordResetTokenValidQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserIsPasswordResetTokenValidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserIsPasswordResetTokenValidQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useUserIsPasswordResetTokenValidQuery(baseOptions: Apollo.QueryHookOptions<UserIsPasswordResetTokenValidQuery, UserIsPasswordResetTokenValidQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserIsPasswordResetTokenValidQuery, UserIsPasswordResetTokenValidQueryVariables>(UserIsPasswordResetTokenValidDocument, options);
      }
export function useUserIsPasswordResetTokenValidLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserIsPasswordResetTokenValidQuery, UserIsPasswordResetTokenValidQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserIsPasswordResetTokenValidQuery, UserIsPasswordResetTokenValidQueryVariables>(UserIsPasswordResetTokenValidDocument, options);
        }
export type UserIsPasswordResetTokenValidQueryHookResult = ReturnType<typeof useUserIsPasswordResetTokenValidQuery>;
export type UserIsPasswordResetTokenValidLazyQueryHookResult = ReturnType<typeof useUserIsPasswordResetTokenValidLazyQuery>;
export type UserIsPasswordResetTokenValidQueryResult = Apollo.QueryResult<UserIsPasswordResetTokenValidQuery, UserIsPasswordResetTokenValidQueryVariables>;