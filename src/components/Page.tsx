import React from 'react';
import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';

import Grid from './Grid';
import Module from './Module';
import { GUTTER_SIZE } from '../constants';

const Page = () => {
  const [modules, setModules] = React.useState([
    { id: 1, coord: { x: 1, y: 80, w: 2, h: 200 } },
    { id: 2, coord: { x: 5, y: 0, w: 3, h: 100 } },
    { id: 3, coord: { x: 4, y: 310, w: 3, h: 200 } },
  ]);

  const containerRef = React.useRef<HTMLDivElement>();

  const [, drop] = useDrop({ accept: 'module' });
  drop(containerRef);

  const containerHeight = React.useMemo(() => (
    Math.max(...modules.map(({ coord: { y, h } }) => y + h)) + GUTTER_SIZE * 2
  ), [modules]);

  const moveModule = (id: number, x: number, y: number) => {
    setModules((prevModules) => {
      let newModules = prevModules.map((module) => {
        if (module.id === id) {
          return { ...module, coord: { ...module.coord, x, y } };
        }
        return module;
      });

      let hasOverlap = false;

      do {
        hasOverlap = false;
        for (let i = 0; i < newModules.length; i++) {
          for (let j = 0; j < newModules.length; j++) {
            if (i !== j) {
              const moduleA = newModules[i];
              const moduleB = newModules[j];

              const isColliding = (
                moduleA.coord.x < moduleB.coord.x + moduleB.coord.w + GUTTER_SIZE &&
                  moduleA.coord.x + moduleA.coord.w + GUTTER_SIZE > moduleB.coord.x &&
                  moduleA.coord.y < moduleB.coord.y + moduleB.coord.h + GUTTER_SIZE &&
                  moduleA.coord.y + moduleA.coord.h + GUTTER_SIZE > moduleB.coord.y
              );

              if (isColliding) {
                hasOverlap = true;
                const newY = moduleB.coord.y + moduleB.coord.h + GUTTER_SIZE;
                newModules = newModules.map((mod, idx) => {
                  if (idx === i) {
                    return { ...mod, coord: { ...mod.coord, y: newY } };
                  }
                  return mod;
                });
              }
            }
          }
        }
      } while (hasOverlap);

      return newModules;
    });
  };


  return (
      <Box
          ref={containerRef}
          position="relative"
          width={1024}
          height={containerHeight}
          margin="auto"
          sx={{
            overflow: 'hidden',
            outline: '1px dashed #ccc',
            transition: 'height 0.2s',
          }}
      >
        <Grid height={containerHeight} />
        {modules.map((module) => (
            <Module key={module.id} data={module} onMove={moveModule} />
        ))}
      </Box>
  );
};

export default React.memo(Page);
