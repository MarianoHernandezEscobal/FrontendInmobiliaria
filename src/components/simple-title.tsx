export const SimpleTitle = ({ title }: { title: string }) => {
    return (
        <div className="mb-10 relative">
        <div className="text-center">
          <h1 className="text-2xl font-semibold uppercase tracking-widest mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {title}
          </h1>
          <div className=" flex justify-center">
            <div className="h-1 w-full md:w-4/5 bg-nav rounded-full"></div>
          </div>
        </div>
      </div>
    );
    }