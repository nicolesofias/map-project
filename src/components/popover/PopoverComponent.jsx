import { Popover, Typography } from '@mui/material'
import React from 'react'

const PopoverComponent = ({anchorEl, open, setOpen, info, setProperties}) => {

    const handleClose = () => {
        setOpen(false);
        setProperties(null)
    }
  return (
        <Popover open={open} anchorEl={anchorEl} onClose={handleClose}>
              {info && Object.keys(info).map((key) => (
                 <Typography key={key}>{key}: {info[key]}</Typography>
            ))
            }
        </Popover>
  )
}

export default PopoverComponent