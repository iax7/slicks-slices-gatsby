import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';

// data is being returned from query below, not from page context
export default function SliceMaster({ data: { slicemaster } }) {
  return (
    <div className="center">
      <Img fluid={slicemaster.image.asset.fluid} />
      <h2>
        <span className="mark">{slicemaster.name}</span>
      </h2>
      <p>{slicemaster.description}</p>
    </div>
  );
}

// slug var is getting its value from pageContext
export const query = graphql`
  query($slug: String!) {
    slicemaster: sanityPerson(slug: { current: { eq: $slug } }) {
      name
      id
      description
      image {
        asset {
          fluid(maxWidth: 1000, maxHeight: 750) {
            ...GatsbySanityImageFluid
          }
        }
      }
    }
  }
`;
