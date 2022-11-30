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
  expenseAdd: ExpenseResponse;
  expenseDelete: Scalars['Boolean'];
  expenseEdit: ExpenseResponse;
  /** Create a session for a user. */
  userLogin: UserResponse;
  userLogout: Scalars['Boolean'];
  /** Register a new user. */
  userRegister: UserResponse;
  userUpdatePreferredCurrency: Scalars['Boolean'];
};


export type MutationCategoryAddArgs = {
  categoryAddData: CategoryAddInput;
};


export type MutationCategoryDeleteArgs = {
  category_name: Scalars['String'];
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


export type MutationUserLoginArgs = {
  loginUserData: UserLoginInput;
};


export type MutationUserRegisterArgs = {
  registerUserData: UserRegisterInput;
};


export type MutationUserUpdatePreferredCurrencyArgs = {
  preferred_currency: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  categoriesGet: CategoryResposne;
  expensesGet: ExpenseResponse;
  expensesTotalCostGet: ExpensesCostResponse;
  expensesTotalCostGetMultiple: ExpensesCostResponseMultiple;
  /** Get the currently logged in user. */
  userGet: UserResponse;
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
  /** The user's preferred currency */
  preferred_currency?: Maybe<Scalars['String']>;
  signup_date: Scalars['DateTime'];
  /** True if the user has verified their email address */
  verified_email: Scalars['Boolean'];
};

export type UserLoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type UserRegisterInput = {
  email: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  password: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  error?: Maybe<GenericFieldError>;
  user?: Maybe<User>;
};

export type CategoryAddMutationVariables = Exact<{
  addData: CategoryAddInput;
}>;


export type CategoryAddMutation = { __typename?: 'Mutation', categoryAdd: { __typename?: 'CategoryResposne', categories?: Array<{ __typename?: 'Category', name: string }> | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type CategoryDeleteMutationVariables = Exact<{
  category_name: Scalars['String'];
}>;


export type CategoryDeleteMutation = { __typename?: 'Mutation', categoryDelete: boolean };

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

export type UserLoginMutationVariables = Exact<{
  loginData: UserLoginInput;
}>;


export type UserLoginMutation = { __typename?: 'Mutation', userLogin: { __typename?: 'UserResponse', user?: { __typename?: 'User', lastname: string } | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type UserLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type UserLogoutMutation = { __typename?: 'Mutation', userLogout: boolean };

export type UserRegisterMutationVariables = Exact<{
  registerData: UserRegisterInput;
}>;


export type UserRegisterMutation = { __typename?: 'Mutation', userRegister: { __typename?: 'UserResponse', user?: { __typename?: 'User', lastname: string } | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type UserUpdatePreferredCurrencyMutationVariables = Exact<{
  preferred_currency: Scalars['String'];
}>;


export type UserUpdatePreferredCurrencyMutation = { __typename?: 'Mutation', userUpdatePreferredCurrency: boolean };

export type CategoriesGetQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesGetQuery = { __typename?: 'Query', categoriesGet: { __typename?: 'CategoryResposne', categories?: Array<{ __typename?: 'Category', name: string, default_currency: string }> | null, error?: { __typename?: 'GenericFieldError', name: string } | null } };

export type ExpensesGetQueryVariables = Exact<{
  getData: ExpensesGetInput;
}>;


export type ExpensesGetQuery = { __typename?: 'Query', expensesGet: { __typename?: 'ExpenseResponse', expenses?: Array<{ __typename?: 'Expense', id: string, date: any, price: number, currency: string }> | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type ExpensesTotalCostGetQueryVariables = Exact<{
  getData: ExpensesGetInput;
}>;


export type ExpensesTotalCostGetQuery = { __typename?: 'Query', expensesTotalCostGet: { __typename?: 'ExpensesCostResponse', costs?: Array<{ __typename?: 'ExpenseTotalCost', price: number, currency: string }> | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type ExpensesTotalCostGetMultipleQueryVariables = Exact<{
  getData: ExpensesGetInputMultiple;
}>;


export type ExpensesTotalCostGetMultipleQuery = { __typename?: 'Query', expensesTotalCostGetMultiple: { __typename?: 'ExpensesCostResponseMultiple', costs?: Array<{ __typename?: 'ExpenseTotalCostMultiple', category_name: string, total: Array<{ __typename?: 'ExpenseTotalCost', price: number, currency: string }> }> | null, error?: { __typename?: 'GenericFieldError', name: string, field?: string | null } | null } };

export type UserGetQueryVariables = Exact<{ [key: string]: never; }>;


export type UserGetQuery = { __typename?: 'Query', userGet: { __typename?: 'UserResponse', user?: { __typename?: 'User', lastname: string, preferred_currency?: string | null } | null, error?: { __typename?: 'GenericFieldError', name: string } | null } };


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
export const ExpensesGetDocument = gql`
    query ExpensesGet($getData: ExpensesGetInput!) {
  expensesGet(expenseGetData: $getData) {
    expenses {
      id
      date
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
      preferred_currency
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