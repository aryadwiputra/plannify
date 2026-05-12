<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait HasFile
{
    public function upload_file(Request $request, string $column, string $folder, string $disk = 'public'): ?string
    {
        return $request->hasFile($column) ? $request->file($column)->store($folder, $disk) : null;
    }

    public function update_file(Request $request, Model $model, string $column, string $folder, string $disk = 'public'): ?string
    {
        if ($request->hasFile($column)) {
            if ($model->$column) {
                Storage::disk($disk)->delete($model->$column);
            }

            $thumbnail = $request->file($column)->store($folder, $disk);
        } else {
            $thumbnail = $model->$column;
        }

        return $thumbnail;
    }

    public function delete_file(Model $model, string $column, string $disk = 'public'): void
    {
        if ($model->$column) {
            Storage::disk($disk)->delete($model->$column);
        }
    }
}
