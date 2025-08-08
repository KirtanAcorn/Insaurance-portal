import { FileText, Plus} from "lucide-react"

const ClaimsHeader = ({openIsModalOpenNew}) => {
  return (
    <>
    <div className={`mb-6 p-6 rounded-2xl bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-black">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Claims Management</h2>
                <p className="text-purple-100">Advanced claims processing and policy integration</p>
              </div>
            </div>  
            <button 
            onClick={() => openIsModalOpenNew(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors text-black cursor-pointer">
              <Plus className="w-4 h-4" />
              <span className="font-medium">New Claim</span>
            </button>
          </div>
        </div>
    </>
  )
}

export default ClaimsHeader