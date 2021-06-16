import React from 'react';
import styled from '@emotion/styled/';

import { ReactComponent as DayCloudyIcon } from './../assets/images/day-cloudy.svg';

const Container = styled.div`
  flex-basis: 30%;
  svg {
    max-height: 110px;
  }
`;

export default function WeatherIcon () {
  return (
    <Container>
      <DayCloudyIcon />
    </Container>
  )
}
