import { Popover, Typography } from '@mui/material'
import React from 'react'

const PopoverComponent = ({anchorEl, open, handleClose, info}) => {

  return (
        info?
        <Popover open={open} anchorEl={anchorEl} onClose={handleClose}>
              {Object.keys(info).map((key) => (
                 <Typography key={key}>{key}: {info[key]}</Typography>
            ))
            }
        </Popover>
        :
        <></>
  )
}

export default PopoverComponent