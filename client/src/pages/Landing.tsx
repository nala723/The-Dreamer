import React from 'react';
import styled from 'styled-components';
import Footer from '../components/Footer';

function Landing() {
  return (
      <Container>
        <MainSection> 
          메인섹션
        </MainSection>
        <Section top='calc(100vh - 4.375rem)'>
          두번째
        </Section>  
        <Section top='calc((100vh - 4.375rem)*2)'>
          세번째
        </Section>  
        <Section top='calc((100vh - 4.375rem)*3)'>
          네번째
        </Section>  
        <Section top='calc((100vh - 4.375rem)*4)'>
          다섯번째
        </Section>  
        <Section top='calc((100vh - 4.375rem)*5)'>
          여섯번째
        </Section>  
        <Footer />
      </Container>
  );
}


export default Landing;

const Container = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 350rem;
`;
const MainSection = styled.section`
  position: absolute; 
  ${props=>props.theme.flexRow};
  height: calc(100vh - 4.375rem);
  color: white;
`;
const Section = styled(MainSection)<{ top: string }>`
  top: ${props=> props.top};
`;
// const ThdSection = styled(ScdSection)`
// `;
// const FrthSection = styled(ScdSection)`
// `;
// const FinalSection = styled(ScdSection)`
// `;