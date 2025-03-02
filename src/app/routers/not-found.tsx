import { useRouteError, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  const error = useRouteError()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      <p className="text-xl mb-6">Sorry, an unexpected error has occurred.</p>
      <p className="text-muted-foreground mb-8">
        {'Page not found'}
      </p>
      
      <Button asChild>
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  )
}