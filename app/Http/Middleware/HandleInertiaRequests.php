<?php

namespace App\Http\Middleware;

use App\Http\Resources\UsersSingleResource;
use App\Http\Resources\WorkspaceSidebarResource;
use App\Models\Member;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => fn() => $request->user() ? new UsersSingleResource($request->user()) : null,
            ],
            'flash_message' => fn() => [
                'type' => $request->session()->get('type'),
                'message' => $request->session()->get('message'),
            ],
            'workspaces' => fn() => $request->user() ? WorkspaceSidebarResource::collection(
                Member::query()
                    ->where('user_id', $request->user()->id)
                    ->whereHasMorph('memberable', Workspace::class)
                    ->get()
            ) : null,
        ];
    }
}
