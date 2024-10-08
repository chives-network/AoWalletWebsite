
// ** React Imports
import { Fragment, memo } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import { useTranslation } from 'react-i18next'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import { formatHash, formatToken } from '@configs/functions'
import Backdrop from '@mui/material/Backdrop'

import Grid from '@mui/material/Grid'

import Pagination from '@mui/material/Pagination'
import Icon from '@/@core/components/icon'

const TokenReceivedTransactions = (prop: any) => {
  
  const { tokenGetInfor, setPageId, pageId, pageCount, startIndex } = prop

  const { t } = useTranslation()

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPageId(page)
    console.log("handlePageChange 1", event)
  }  

  //console.log("handlePageChange 2", pageId, pageCount, tokenGetInfor)
  
  return (
    <Box
        sx={{
            py: 3,
            px: 5,
            display: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: theme => `1px solid ${theme.palette.divider}`
        }}
        >
        <TableContainer>
            <Table>
            <TableBody>
            <TableRow sx={{my: 0, py: 0}}>
                <TableCell sx={{my: 0, py: 0}}>
                    Id
                </TableCell>
                <TableCell sx={{my: 0, py: 0}}>
                    From
                </TableCell>
                <TableCell sx={{my: 0, py: 0}}>
                    Amount
                </TableCell>
            </TableRow>
            {tokenGetInfor && tokenGetInfor.AoTokenReceivedTransactionsList && tokenGetInfor.AoTokenReceivedTransactionsList.map((Item: string[], Index: number)=>{

                return (
                    <Fragment key={Index}>
                        {Item[1] != '' &&  (
                            <TableRow key={Index} sx={{my: 0, py: 0}}>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', my: 0, py: 0 }}>{Number(startIndex) + Index}</Typography>
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Typography noWrap variant='body2' sx={{ color: 'info.main', pr: 1, display: 'inline', my: 0, py: 0 }}>{formatHash(Item[1], 15)}</Typography>
                                    {Item && (
                                        <IconButton aria-label='capture screenshot' color='secondary' size='small' onClick={()=>{
                                            navigator.clipboard.writeText(Item[1]);
                                        }}>
                                            <Icon icon='material-symbols:file-copy-outline-rounded' fontSize='inherit' />
                                        </IconButton>
                                    )}
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    {Item && Item[2] && (
                                        <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', my: 0, py: 0 }}>{formatToken(Number(Item[2]), tokenGetInfor.Denomination)}</Typography>
                                    )}
                                </TableCell>
                                <TableCell sx={{my: 0, py: 0}}>
                                    <Icon icon='solar:dollar-bold' />
                                </TableCell>
                            </TableRow>
                        )}
                    </Fragment>
                )
                
            })}
        
            </TableBody>
            </Table>

            {tokenGetInfor && tokenGetInfor.AoTokenReceivedTransactionsList == null && (
                <Box sx={{ pl: 5, py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                        <CircularProgress />
                        <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', ml: 5, pt: 0 }}>{t('Loading token received txs...')}</Typography>
                    </Grid>
                    </Box>
                </Box>
            )}

            {tokenGetInfor && tokenGetInfor.AoTokenReceivedTransactionsList && tokenGetInfor.AoTokenReceivedTransactionsList.length == 0 && tokenGetInfor.isLoading == false && (
                <Box sx={{ pl: 5, py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                        <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', ml: 5, pt: 0 }}>{t('No Data')}</Typography>
                    </Grid>
                    </Box>
                </Box>
            )}

            {tokenGetInfor && tokenGetInfor.AoTokenReceivedTransactionsList && tokenGetInfor.AoTokenReceivedTransactionsList.length == 0 && tokenGetInfor.isLoading == true && (
                <Box sx={{ pl: 5, py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                        <Typography noWrap variant='body2' sx={{ color: 'primary.main', pr: 3, display: 'inline', ml: 5, pt: 0 }}>{t('Loading')}</Typography>
                    </Grid>
                    </Box>
                </Box>
            )}

            {pageCount > 0 && tokenGetInfor.isLoading == false && (
                <Box sx={{ pl: 5, py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item key={"Pagination"} xs={12} sm={12} md={12} lg={12} sx={{ padding: '10px 0 10px 0' }}>
                        <Pagination size='small' count={pageCount} variant='outlined' color='primary' page={pageId} onChange={handlePageChange} siblingCount={1} boundaryCount={1} />
                    </Grid>
                    </Box>
                </Box>
            )}

            <Backdrop
                open={tokenGetInfor.isLoading}
                sx={{
                zIndex: 5,
                position: 'absolute',
                color: 'common.white',
                backgroundColor: 'action.disabledBackground'
                }}
            >
                <CircularProgress color='inherit' />
            </Backdrop>

        </TableContainer>

    </Box>
  );
  
}


export default memo(TokenReceivedTransactions)
