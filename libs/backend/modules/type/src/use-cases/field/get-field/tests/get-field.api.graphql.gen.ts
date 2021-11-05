import * as Types from '@codelab/frontend/abstract/codegen'

import { TestFieldFragment } from '../../../../tests/graphql/TestField.fragment.graphql.gen'
import { gql } from '@apollo/client'
import { TestFieldFragmentDoc } from '../../../../tests/graphql/TestField.fragment.graphql.gen'
import * as Apollo from '@apollo/client'
const defaultOptions = {}
export type TestGetFieldQueryVariables = Types.Exact<{
  input: Types.GetFieldInput
}>

export type TestGetFieldQuery = {
  getField?: TestFieldFragment | null | undefined
}

export const TestGetFieldGql = gql`
  query TestGetField($input: GetFieldInput!) {
    getField(input: $input) {
      ...TestField
    }
  }
  ${TestFieldFragmentDoc}
`

/**
 * __useTestGetFieldQuery__
 *
 * To run a query within a React component, call `useTestGetFieldQuery` and pass it any options that fit your needs.
 * When your component renders, `useTestGetFieldQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTestGetFieldQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTestGetFieldQuery(
  baseOptions: Apollo.QueryHookOptions<
    TestGetFieldQuery,
    TestGetFieldQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<TestGetFieldQuery, TestGetFieldQueryVariables>(
    TestGetFieldGql,
    options,
  )
}
export function useTestGetFieldLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TestGetFieldQuery,
    TestGetFieldQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<TestGetFieldQuery, TestGetFieldQueryVariables>(
    TestGetFieldGql,
    options,
  )
}
export type TestGetFieldQueryHookResult = ReturnType<
  typeof useTestGetFieldQuery
>
export type TestGetFieldLazyQueryHookResult = ReturnType<
  typeof useTestGetFieldLazyQuery
>
export type TestGetFieldQueryResult = Apollo.QueryResult<
  TestGetFieldQuery,
  TestGetFieldQueryVariables
>
export function refetchTestGetFieldQuery(
  variables?: TestGetFieldQueryVariables,
) {
  return { query: TestGetFieldGql, variables: variables }
}
