import React from 'react';
import { Box } from '@mui/material';
import { useDrag, useDragDropManager } from 'react-dnd';
import { useRafLoop } from 'react-use';

import ModuleInterface from '../types/ModuleInterface';
import { moduleW2LocalWidth, moduleX2LocalX, moduleY2LocalY, localX2ModuleX, localY2ModuleY } from '../helpers';
import { COLUMN_WIDTH, GUTTER_SIZE, NUM_COLUMNS } from '../constants';

type ModuleProps = {
  data: ModuleInterface;
  onMove: (id: number, x: number, y: number) => void;
};

const Module = (props: ModuleProps) => {
  const { data: { id, coord: { x, y, w, h } }, onMove } = props;

  const [{ top, left }, setPosition] = React.useState(() => ({
    top: moduleY2LocalY(y),
    left: moduleX2LocalX(x),
  }));

  const dndManager = useDragDropManager();
  const initialPosition = React.useRef<{ top: number; left: number }>();

  const [stop, start] = useRafLoop(() => {
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();

    if (!initialPosition.current || !movement) {
      return;
    }

    const newTop = initialPosition.current.top + movement.y;
    const newLeft = initialPosition.current.left + movement.x;

    // Boundary checks and snapping to grid columns with edge margin
    const maxLeft = (NUM_COLUMNS - w) * COLUMN_WIDTH + GUTTER_SIZE;
    const snappedLeft = Math.max(GUTTER_SIZE, Math.min(maxLeft, Math.round(newLeft / COLUMN_WIDTH) * COLUMN_WIDTH));

    const snappedTop = Math.max(GUTTER_SIZE, newTop);

    setPosition({
      top: snappedTop,
      left: snappedLeft,
    });

    // Report new position
    onMove(id, localX2ModuleX(snappedLeft), localY2ModuleY(snappedTop));
  }, false);

  const [, drag] = useDrag(() => ({
    type: 'module',
    item: () => {
      initialPosition.current = { top, left };
      start();
      return { id };
    },
    end: stop,
  }), [top, left]);

  return (
      <Box
          ref={drag}
          display="flex"
          position="absolute"
          border={1}
          borderColor="grey.500"
          padding="10px"
          bgcolor="rgba(0, 0, 0, 0.5)"
          top={top}
          left={left}
          width={moduleW2LocalWidth(w)}
          height={h}
          sx={{
            transitionProperty: 'top, left',
            transitionDuration: '0.1s',
            '& .resizer': {
              opacity: 0,
            },
            '&:hover .resizer': {
              opacity: 1,
            },
          }}
      >
        <Box
            flex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize={40}
            color="#fff"
            sx={{ cursor: 'move' }}
            draggable
        >
          <Box sx={{ userSelect: 'none', pointerEvents: 'none' }}>{id}</Box>
        </Box>
      </Box>
  );
};

export default React.memo(Module);
