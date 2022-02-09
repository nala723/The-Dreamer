import React from 'react'
import styled, { css } from 'styled-components'

function Toggle(props: {
  themeToggler: () => void
  themeValue: string
}): JSX.Element {
  const { themeToggler, themeValue } = props

  return (
    <ToggleDiv onClick={themeToggler} themeValue={themeValue}>
      <Circle themeValue={themeValue} />
      <p>{themeValue === 'light' ? '🌙' : '🌞'}</p>
    </ToggleDiv>
  )
}

export default Toggle

const ToggleDiv = styled.div<{ themeValue: string }>`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 3.25rem;
  height: 1.375rem;
  border: 1px solid #898989;
  border-radius: 2rem;
  background-color: ${(props) => props.theme.toggle};
  cursor: pointer;
  > p {
    position: absolute;
    font-size: 14px;
    ${(props) =>
      props.themeValue === 'dark'
        ? css`
            right: 3px;
          `
        : css`
            left: 3px;
          `};
    ${(props) => props.theme.mobile} {
      font-size: 12px;
    }
  }
  ${(props) => props.theme.mobile} {
    min-width: 2.8rem;
    height: 1.1rem;
  }
`
const Circle = styled.div<{ themeValue: string }>`
  position: absolute;
  width: 1.275rem;
  height: 1.275rem;
  border-radius: 100%;
  background-color: white;
  transition: all 0.3s ease-in-out;
  ${(props) =>
    props.themeValue === 'light'
      ? css`
          left: 1.8rem;
          right: 1px;
        `
      : css`
          left: 1px;
        `};
  ${(props) => props.theme.mobile} {
    width: 1.1rem;
    height: 1.1rem;
    ${(props) =>
      props.themeValue === 'light'
        ? css`
            left: 1.55rem;
            right: 1px;
          `
        : css`
            left: 1px;
          `};
  }
`
