// ** React Imports
import { useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

// ** Third Party Imports
import { useDropzone } from 'react-dropzone'

import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { importWalletJsonFile, readFileText } from '@functions/ChivesWallets'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(15.75)
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4)
  },
  [theme.breakpoints.down('sm')]: {
    width: 160
  }
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4)
  }
}))

const UploadWalletJsonFile = ( { handleRefreshWalletData }: any ) => {
  // ** Hook
  const { t } = useTranslation()
    
  // ** State
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDialog, setIsDialog] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [walletAddress, setWalletAddress] = useState<string>("")

  const handleClose = () => {
    setOpen(false)
    setIsDialog(false)
    handleRefreshWalletData()
  }

  // ** Hook
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.json']
    },
    onDrop: (acceptedFiles: File[]) => {
        acceptedFiles.map((file: File) => {
            handleImportWalletJsonFile(file)
        })
    }
  })
  
  const handleImportWalletJsonFile = async (file: File) => {
    const jsonFileContent: string = await readFileText(file)
    const NewWalletData: any = await importWalletJsonFile(JSON.parse(jsonFileContent))
    if(NewWalletData) {
        console.log("NewWalletData", NewWalletData)
        setIsLoading(true)
        if(true) {
            setIsLoading(false)
            setIsDialog(true)
            setOpen(true)
            if(NewWalletData?.data?.arweave?.key)  {
                setWalletAddress(NewWalletData?.data?.arweave?.key)
            }
        }
    }
    else {
    }
  };

  return (
    <Fragment>

        {isDialog == true ? 
        <Fragment>
            <Dialog
                open={open}
                disableEscapeKeyDown
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                    handleClose()
                    }
                }}
                >
                <DialogTitle id='alert-dialog-title'>{`${t(`Wallet created successfully`)}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                    {`${t(`Wallet Address`)}`}: {walletAddress}
                    </DialogContentText>
                </DialogContent>
                <DialogActions className='dialog-actions-dense'>
                    <Button onClick={handleClose}>{`${t(`Close`)}`}</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
        :
        <Fragment></Fragment>
        }

        {isLoading == true ? 
        <Fragment>
            <CardHeader title={`${t('Create a new wallet')}...`} />
            <CardContent>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <CircularProgress sx={{ mb: 4 }} />
                            <Typography>{`${t(`Executing your command, please wait a moment`)}`}...</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Fragment>
        :
        <Fragment>
            <CardHeader title={`${t('Method 1: Create a new wallet directly')}`} />
            <CardContent>
                <Grid container spacing={5}>
                    <Grid item xs={12}>
                        <Button size='large' type='submit' variant='contained' onClick={(event) => generateNewWallet(event)}>
                        {`${t(`Create Wallet`)}`}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>

            <Divider sx={{ m: '0 !important' }} />

            <CardHeader title={`${t('Method 2: Upload your wallet json file')}`} />
            <CardContent>
                <Box {...getRootProps({ className: 'dropzone' })} sx={acceptedFiles.length ? {} : {}}>
                    <input {...getInputProps()} />
                    <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
                        <Img alt='Upload img' src='/images/misc/upload.png' />
                        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
                            <HeadingTypography variant='h5'>{`${t(`Drop wallet json file here or click to upload.`)}`}</HeadingTypography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
            
        </Fragment>
        }
        
        
    </Fragment>
  )
}

export default UploadWalletJsonFile
