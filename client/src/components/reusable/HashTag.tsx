import React from 'react';
import styled from 'styled-components';

function HashTag({height, width, text}: {height?: string; width?: string; text: string;}) {
  return (
      <Tag>{text}</Tag>
  );
}

export default HashTag;

const Tag = styled.div`
  width: auto;
  height: auto;
  background-color: ${props=>props.theme.moretransp};
  color: #DDC9FF;
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  cursor: pointer;
  overflow: hidden;

`;
