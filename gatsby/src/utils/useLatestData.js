import { useState, useEffect } from 'react';

// Hack to get syntax highlight and formating on VSCODE but without importing any library
// this also works on css prefix (see line 35 gql for usage)import { useScrollRestoration } from 'gatsby-react-router-scroll';

const gql = String.raw;
const deets = `
    name
    _id
    image {
      asset {
        url
        metadata {
          lqip
        }
      }
    }
`;

export default function useLatestData() {
  // Hot slices
  const [hotSlices, setHotSlices] = useState();
  // slicemasters
  const [slicemasters, setSlicemasters] = useState();

  // Use a side effect to Fetch the data from the graphql endpoint
  useEffect(() => {
    // when the component loads, fetch the data
    fetch(process.env.GATSBY_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: gql`
          query {
            StoreSettings(id: "downtown") {
              name
              slicemaster {
                ${deets}
              }
              hotSlices {
                ${deets}
              }
            }
          }
        `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // set the data to state
        setHotSlices(res.data.StoreSettings.hotSlices);
        setSlicemasters(res.data.StoreSettings.slicemaster);
      })
      .catch((err) => {
        console.log('SHOOOOT!');
        console.log(err);
      });
  }, []);
  // ^ no constraint to run the function when a var changes

  return {
    hotSlices,
    slicemasters,
  };
}
