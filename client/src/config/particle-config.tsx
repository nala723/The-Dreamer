import React from 'react';
import styled from 'styled-components';
import Particles from 'react-tsparticles';


export default function ParticlesConfig() {

  return(
      <Particles options={{
        fullScreen: {
          zIndex: 1
        },
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "repulse"
            },
            onHover: {
              enable: true,
              mode: "bubble"
            }
          },
          modes: {
            bubble: {
              distance: 250,
              duration: 2,
              opacity: 0,
              size: 3
            },
            grab: {
              distance: 400
            },
            repulse: {
              distance: 400
            }
          }
        },
        particles: {
          color: {
            value: "#ffffff"
          },
          links: {
            color: {
              value: "#ffffff"
            },
            distance: 150,
            opacity: 0.4,
            shadow: {
              color: {
                value: "#5300ff"
              }
            }
          },
          move: {
            attract: {
              rotate: {
                x: 600,
                y: 600
              }
            },
            enable: true,
            path: {},
            outModes: {
              bottom: "out",
              left: "out",
              right: "out",
              top: "out",
              default: "out",
            },
            random: true,
            speed: 1,
            spin: {}
          },
          number: {
            density: {
              enable: true
            },
            value: 160
          },
          opacity: {
            random: {
              enable: true,
              minimumValue: 0
            },
            value: {
              min: 0,
              max: 1
            },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0
            }
          },
          size: {
            random: {
              enable: true,
              minimumValue: 0
            },
            value: {
              min: 1,
              max: 3
            },
            animation: {
              speed: 4,
              minimumValue: 0.3
            }
          },
          twinkle: {
            particles: {
              frequency: 0.95
            }
          }
        }
      }}/>
  )
};


 
