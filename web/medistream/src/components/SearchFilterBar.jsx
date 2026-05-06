import { Stack, Button, TextField, InputAdornment } from '@mui/material';
import { FilterList, Search } from '@mui/icons-material';

export const SearchFilterBar = ({ onSearch, onFilter, searchPlaceholder = "Search..." }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Button
      startIcon={<FilterList />}
      variant="outlined"
      onClick={onFilter}
      sx={{
        textTransform: 'none',
        borderRadius: 2,
        borderColor: '#e5e7eb',
        color: '#667eea',
        fontWeight: 500,
        fontFamily: '"Arimo", "Poppins", "Inter", "SF Pro Text", "Segoe UI", sans-serif',
        fontSize: '0.875rem',
        px: 2,
        py: 0.75,
        '&:hover': {
          borderColor: '#667eea',
          background: 'rgba(102, 126, 234, 0.04)',
        }
      }}
    >
      Filter
    </Button>
    
    <TextField 
      placeholder={searchPlaceholder}
      variant="outlined"
      size="small"
      onChange={(e) => onSearch(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ color: '#9ca3af', fontSize: 20 }} />
          </InputAdornment>
        ),
      }}
      sx={{
        width: '280px',
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          fontWeight: 400,
          fontSize: '0.875rem',
          fontFamily: '"Arimo", "Poppins", "Inter", "SF Pro Text", "Segoe UI", sans-serif',
          '& fieldset': { borderColor: '#e5e7eb', },
          '&:hover fieldset': { borderColor: '#d1d5db', },
          '&.Mui-focused fieldset': { borderColor: '#667eea' },
          '& .MuiOutlinedInput-input': {py: 1,}
        },
      }}
    />
  </Stack>
);