import { Button, IconButton, Popover, Typography } from '@mui/material'
import React from 'react'

const PopoverComponent = ({anchorEl, open, handleClose, info, removeButton, handleRemove}) => {

  return (
        info?
        <Popover open={open} anchorEl={anchorEl} onClose={handleClose}>
              {Object.keys(info).map((key) => (
                 <Typography key={key}>{key}: {info[key]}</Typography>
            ))
            }
            {removeButton && <Button onClick={handleRemove} sx={{marginTop: '10px'}}>remove feature</Button>}
        </Popover>
        :
        <></>
  )
}

export default PopoverComponent