import { Box, Dialog, Typography } from '@mui/material'
import React from 'react'

const DialogComponent = ({open, setOpen, info}) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Box sx={{width: '300px', height: "100px", paddingX: '10px'}}>
        {info.name !== "" && <Typography>name: {info.name}</Typography>}
        {info.description !== "" && <Typography>description: {info.description}</Typography>}
        {info.ruler !== "" && <Typography>ruler: {info.ruler}</Typography>}
        {info.established !== "" && <Typography>established: {info.established}</Typography>}
      </Box>
    </Dialog>
  )
}

export default DialogComponent